import { NextResponse } from "next/server";
import { Index } from "@upstash/vector";
import { Receiver } from "@upstash/qstash";

const vectorDb = new Index({
  url: process.env.UPSTASH_VECTOR_REST_URL as string,
  token: process.env.UPSTASH_VECTOR_REST_TOKEN as string,
});

const receiver = new Receiver({
  currentSigningKey: process.env.QSTASH_CURRENT_SIGNING_KEY as string,
  nextSigningKey: process.env.QSTASH_NEXT_SIGNING_KEY as string,
});

function chunkText(text: string, maxCharLength: number = 1500): string[] {
  const paragraphs = text.split(/\n\n+/);
  const chunks: string[] = [];
  let currentChunk = "";

  for (const paragraph of paragraphs) {
    if (currentChunk.length + paragraph.length > maxCharLength) {
      if (currentChunk) chunks.push(currentChunk.trim());
      currentChunk = paragraph;
    } else {
      currentChunk += (currentChunk ? "\n\n" : "") + paragraph;
    }
  }
  if (currentChunk) chunks.push(currentChunk.trim());
  return chunks;
}

export async function POST(req: Request) {
  try {
    const bodyText = await req.text();
    const signature = req.headers.get("Upstash-Signature");
    
    if (!signature || !(await receiver.verify({ signature, body: bodyText }))) {
      return NextResponse.json({ error: "Invalid signature" }, { status: 401 });
    }

    // Extract the raw text chunk assigned to this worker
    const body = JSON.parse(bodyText);
    const { text, sourceUrl, batchIndex } = body;

    if (!text) {
      return NextResponse.json({ error: "No text provided" }, { status: 400 });
    }

    console.log(`⚙️ Processing batch ${batchIndex} for ${sourceUrl}`);

    // Fine-grained chunking for the Vector DB (1500 chars)
    const chunks = chunkText(text);
      
    const batchedUpserts = chunks.map((chunkText, index) => ({
      // Unique ID ensuring we don't overwrite chunks from the same source
      id: `${Buffer.from(sourceUrl).toString('base64').slice(0,10)}-batch${batchIndex}-chunk${index}`,
      data: chunkText,
      metadata: { 
        source: sourceUrl, 
        batchIndex: batchIndex,
        chunkIndex: index, 
        updatedAt: new Date().toISOString() 
      }
    }));

    await vectorDb.upsert(batchedUpserts);
    
    console.log(`✅ Upserted ${chunks.length} vectors for batch ${batchIndex}`);

    return NextResponse.json({ success: true }, { status: 200 });

  } catch (error: any) {
    console.error("🚨 WORKER ERROR:", error);
    // 500 error triggers QStash to retry this specific batch if Upstash API fails
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}