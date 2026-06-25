import { NextResponse } from "next/server";
import { Client } from "@upstash/qstash";

const qstash = new Client({
  token: process.env.QSTASH_TOKEN as string,
});

export async function POST(req: Request) {
  try {
    // 1. Receive the payload from Firecrawl
    const payload = await req.json();
    
    if (!payload.success || !payload.data?.markdown) {
      console.error("Firecrawl job failed or returned no data.");
      return NextResponse.json({ error: "Invalid payload" }, { status: 400 });
    }

    const fullMarkdown = payload.data.markdown;
    const sourceUrl = payload.data.metadata?.sourceURL || "unknown-source";

    console.log(`📥 Received massive payload for ${sourceUrl}. Length: ${fullMarkdown.length} chars.`);

    // 2. Split the massive 2000-page string into "Super Chunks" (e.g., ~50,000 characters each)
    // This prevents QStash payload limits and keeps the final worker fast.
    const SUPER_CHUNK_SIZE = 50000; 
    const superChunks = [];
    
    for (let i = 0; i < fullMarkdown.length; i += SUPER_CHUNK_SIZE) {
      superChunks.push(fullMarkdown.substring(i, i + SUPER_CHUNK_SIZE));
    }

    console.log(`🔪 Sliced into ${superChunks.length} Super Chunks. Queuing to QStash...`);

    const workerUrl = `${process.env.NEXT_PUBLIC_APP_URL}/api/process-chunk`;

    // 3. Fan out! Send each Super Chunk to QStash
    for (let i = 0; i < superChunks.length; i++) {
      await qstash.publishJSON({
        url: workerUrl,
        body: { 
          text: superChunks[i], 
          sourceUrl: sourceUrl,
          batchIndex: i
        },
      });
    }

    return NextResponse.json({ success: true, message: `Queued ${superChunks.length} batches.` }, { status: 200 });

  } catch (error: any) {
    console.error("🚨 WEBHOOK ERROR:", error);
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}