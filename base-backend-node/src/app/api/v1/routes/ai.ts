import { Hono } from 'hono';
import { Bindings } from '../../../core/types';
import { Client as QStashClient, Receiver } from '@upstash/qstash';
import { Index as VectorIndex } from '@upstash/vector';

export const aiRouter = new Hono<{ Bindings: Bindings }>();

aiRouter.post('/firecrawl-webhook', async (c) => {
  try {
    const payload = await c.req.json();
    
    let documents: any[] = [];
    if (Array.isArray(payload.data)) {
      documents = payload.data;
    } else if (payload.data && payload.data.markdown) {
      documents = [payload.data];
    }

    if (documents.length === 0) {
      console.log(`Ack Firecrawl event (type: ${payload.type || 'unknown'}) - no markdown data found in this payload.`);
      return c.json({ success: true, message: "Acknowledged event" }, 200);
    }

    const qstash = new QStashClient({
      token: c.env.QSTASH_TOKEN,
    });
    const baseUrl = c.env.APP_URL || new URL(c.req.url).origin;
    const workerUrl = `${baseUrl}/api/v1/ai/process-chunk`;

    let totalBatches = 0;

    for (const doc of documents) {
      if (!doc.markdown) continue;

      const fullMarkdown = doc.markdown;
      const sourceUrl = doc.metadata?.sourceURL || "unknown-source";

      console.log(`📥 Received payload for ${sourceUrl}. Length: ${fullMarkdown.length} chars.`);

      // Split into Super Chunks (~50,000 chars)
      const SUPER_CHUNK_SIZE = 50000; 
      const superChunks = [];
      
      for (let i = 0; i < fullMarkdown.length; i += SUPER_CHUNK_SIZE) {
        superChunks.push(fullMarkdown.substring(i, i + SUPER_CHUNK_SIZE));
      }

      console.log(`🔪 Sliced ${sourceUrl} into ${superChunks.length} Super Chunks. Queuing to QStash...`);

      for (let i = 0; i < superChunks.length; i++) {
        await qstash.publishJSON({
          url: workerUrl,
          body: { 
            text: superChunks[i], 
            sourceUrl: sourceUrl,
            batchIndex: i
          },
        });
        totalBatches++;
      }
    }

    return c.json({ success: true, message: `Queued ${totalBatches} total batches.` }, 200);
  } catch (error: any) {
    console.error("🚨 WEBHOOK ERROR:", error);
    return c.json({ success: false, error: error.message }, 500);
  }
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

aiRouter.post('/process-chunk', async (c) => {
  try {
    const bodyText = await c.req.text();
    const signature = c.req.header('Upstash-Signature');
    
    const receiver = new Receiver({
      currentSigningKey: c.env.QSTASH_CURRENT_SIGNING_KEY,
      nextSigningKey: c.env.QSTASH_NEXT_SIGNING_KEY,
    });

    if (!signature || !(await receiver.verify({ signature, body: bodyText }))) {
      return c.json({ error: "Invalid signature" }, 401);
    }

    const body = JSON.parse(bodyText);
    const { text, sourceUrl, batchIndex } = body;

    if (!text) {
      return c.json({ error: "No text provided" }, 400);
    }

    console.log(`⚙️ Processing batch ${batchIndex} for ${sourceUrl}`);

    const chunks = chunkText(text);
      
    // Buffer is not natively available in Cloudflare Workers without a polyfill or importing from 'node:buffer',
    // We can use a simpler base64 encoding approach suitable for Workers:
    const encodeBase64 = (str: string) => btoa(unescape(encodeURIComponent(str))).replace(/=/g, '').slice(0, 10);

    const batchedUpserts = chunks.map((chunkText, index) => ({
      id: `${encodeBase64(sourceUrl)}-batch${batchIndex}-chunk${index}`,
      data: chunkText,
      metadata: { 
        source: sourceUrl, 
        batchIndex: batchIndex,
        chunkIndex: index, 
        updatedAt: new Date().toISOString() 
      }
    }));

    const vectorDb = new VectorIndex({
      url: c.env.UPSTASH_VECTOR_REST_URL,
      token: c.env.UPSTASH_VECTOR_REST_TOKEN,
    });

    await vectorDb.upsert(batchedUpserts);
    
    console.log(`✅ Upserted ${chunks.length} vectors for batch ${batchIndex}`);

    return c.json({ success: true }, 200);
  } catch (error: any) {
    console.error("🚨 WORKER ERROR:", error);
    return c.json({ success: false, error: error.message }, 500);
  }
});
