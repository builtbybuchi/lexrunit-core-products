# Dr. Andre RAG Pipeline: Step-by-Step Setup Guide

This guide covers the setup of your asynchronous knowledge ingestion pipeline using GitHub Actions (for the schedule), Firecrawl (for scraping), Upstash QStash (for background queuing), Upstash Vector (for the AI brain), and Cloudflare Workers (for hosting the endpoints).

---

## Phase 1: Upstash Setup (Vector & QStash)

### 1. Set up Upstash Vector (The Brain)

1. Go to the [Upstash Console](https://console.upstash.com/).
2. Navigate to **Vector** and click **Create Index**.
3. **Important:** Select a built-in embedding model (e.g., `text-embedding-3-small`). This allows you to send raw text directly to Upstash, which mathematically vectorizes it automatically.
4. Copy your `UPSTASH_VECTOR_REST_URL` and `UPSTASH_VECTOR_REST_TOKEN` and save them.

### 2. Set up Upstash QStash (The Message Queue)

1. In the Upstash Console, navigate to the **QStash** tab.
2. Copy your `QSTASH_TOKEN`. Your Cloudflare Worker will use this to publish messages to the queue.
3. Scroll down to the **Signing Keys** section. Copy the `QSTASH_CURRENT_SIGNING_KEY` and `QSTASH_NEXT_SIGNING_KEY`. Your Cloudflare Worker needs these to verify that incoming requests are genuinely from Upstash.

---

## Phase 2: Cloudflare Workers Setup (The Endpoints)

You need to deploy two endpoints to Cloudflare Workers.

1. **The Webhook (`/api/firecrawl-webhook`)**: Receives the massive JSON from Firecrawl, cuts it into "Super Chunks" (e.g., 50,000 characters), and publishes each chunk to QStash to bypass Cloudflare's timeout limits.
2. **The Worker (`/api/process-chunk`)**: Receives a Super Chunk from QStash, cuts it into fine-grained LLM chunks (1500 chars), and uploads them to Upstash Vector.

### Deployment Steps:

1. Initialize a Cloudflare Worker project (e.g., `npm create cloudflare@latest`).
2. Add your environment variables in the `wrangler.toml` file or via the Cloudflare Dashboard:
* `UPSTASH_VECTOR_REST_URL`
* `UPSTASH_VECTOR_REST_TOKEN`
* `QSTASH_TOKEN`
* `QSTASH_CURRENT_SIGNING_KEY`
* `QSTASH_NEXT_SIGNING_KEY`


3. Deploy your worker using `npx wrangler deploy`.
4. Copy your live Cloudflare Worker URL (e.g., `https://dr-andre-rag.your-username.workers.dev`).

---

## Phase 3: GitHub Actions Setup (The Automation Flow)

We use GitHub Actions to trigger Firecrawl. It tells Firecrawl: *"Read this textbook, and when you are done, push the data to my Cloudflare Worker webhook."*

### 1. Configure GitHub Secrets

1. Go to your GitHub Repository -> **Settings** -> **Secrets and variables** -> **Actions**.
2. Add a new repository secret named `FIRECRAWL_API_KEY` and paste your API key.

### 2. Create the Workflow File

In your repository, create a file at `.github/workflows/trigger-firecrawl.yml` and paste the following:

```yaml
name: Trigger Firecrawl Knowledge Update

on:
  # 1. AUTOMATIC: Runs at midnight on the 1st of every month
  schedule:
    - cron: '0 0 1 * *'
  
  # 2. MANUAL: Allows you to click a button in GitHub to run it instantly
  workflow_dispatch:

jobs:
  trigger-scrape:
    runs-on: ubuntu-latest
    steps:
      - name: Trigger Firecrawl Async Scrape
        run: |
          curl -X POST "https://api.firecrawl.dev/v1/scrape/async" \
          -H "Authorization: Bearer ${{ secrets.FIRECRAWL_API_KEY }}" \
          -H "Content-Type: application/json" \
          -d '{
            "url": "https://example.com/2000-page-medical-textbook.pdf",
            "formats": ["markdown"],
            "webhook": "https://dr-andre-rag.your-username.workers.dev/api/firecrawl-webhook"
          }'

```

*(Make sure to replace the `webhook` URL with your actual Cloudflare Worker URL).*

### 3. How to Manually Activate the Action

You don't have to wait for the 1st of the month. To run it immediately:

1. Go to the **Actions** tab in your GitHub repository.
2. Click on **Trigger Firecrawl Knowledge Update** on the left sidebar.
3. Click the **Run workflow** dropdown button on the right side and click **Run workflow**.

---

## Phase 4: How to Test Locally Before Pushing

Before deploying to Cloudflare, you must test the entire asynchronous flow locally. Because Firecrawl and QStash are external services, they cannot send data to `http://localhost:8787`. You must use **Ngrok** to create a public tunnel to your local machine.

### Step 1: Start your Local Server

Run your local Cloudflare Worker environment:

```bash
npm run start
# or npx wrangler dev (runs typically on port 8787)

```

### Step 2: Start Ngrok

Open a new terminal window and run:

```bash
ngrok http 8787

```

Ngrok will give you a public URL (e.g., `https://a1b2-c3d4.ngrok-free.app`). Leave this terminal open.

### Step 3: Test the QStash Worker Locally

1. Go to the **Upstash QStash Console**.
2. Click **Publish Message**.
3. **Endpoint URL:** `https://your-ngrok-url.ngrok-free.app/api/process-chunk`
4. **Body:** ```json
{
"text": "This is a test medical paragraph about malaria...",
"sourceUrl": "test-local",
"batchIndex": 0
}
```

```


5. Click Publish. Check your local wrangler terminal to verify the chunk was processed and pushed to the Upstash Vector database without signature errors.

### Step 4: Test the Complete Firecrawl Flow Locally

Now test the entire flow, acting as if GitHub Actions just triggered it.

1. Run the `curl` command directly in your local terminal, but replace the `"webhook"` URL with your Ngrok URL:
```bash
curl -X POST "https://api.firecrawl.dev/v1/scrape/async" \
-H "Authorization: Bearer YOUR_FIRECRAWL_KEY" \
-H "Content-Type: application/json" \
-d '{
  "url": "https://example.com/short-test-document.pdf",
  "formats": ["markdown"],
  "webhook": "https://your-ngrok-url.ngrok-free.app/api/firecrawl-webhook"
}'

```


2. Wait a few minutes. Firecrawl will finish scraping and POST the massive payload to your Ngrok URL.
3. Watch your local `wrangler dev` terminal. You will see:
* Your Webhook receive the payload.
* The Webhook splitting the data into Super Chunks.
* The Webhook pushing the chunks to QStash.


4. A few seconds later, QStash will immediately ping your Ngrok URL's `/api/process-chunk` route concurrently until all chunks are stored in Upstash Vector.

Once everything flows perfectly on your local machine, deploy to Cloudflare, update your GitHub Actions YAML to use the production Cloudflare URL, and you are ready!