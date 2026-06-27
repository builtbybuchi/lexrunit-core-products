export const DATABASE_ID = 'website-db';

export class Client {
  public endpoint: string = '';
  public project: string = '';
  public key: string = '';
  setEndpoint(e: string) { this.endpoint = e; return this; }
  setProject(p: string) { this.project = p; return this; }
  setKey(k: string) { this.key = k; return this; }
}

export class Databases {
  constructor(private client: Client) {}

  async listDocuments(databaseId: string, collectionId: string, queries: any[] = []): Promise<any> {
    const url = new URL(`${this.client.endpoint}/databases/${databaseId}/collections/${collectionId}/documents`);
    // Appwrite stringifies queries as JSON strings in headers or URL params? No, in v14 it encodes them.
    // We will just stringify the query array manually as Appwrite expects them natively:
    // e.g. queries[]=equal("slug", ["test"])
    for (const q of queries) {
      if (typeof q === 'string') {
        url.searchParams.append('queries[]', q);
      } else if (q.method) {
        // Simple serialization for Appwrite queries
        const vals = q.values ? `,[${q.values.map((v:any)=>`"${v}"`).join(',')}]` : '';
        url.searchParams.append('queries[]', `${q.method}("${q.attribute}"${vals})`);
      }
    }
    const res = await fetch(url.toString(), {
      headers: {
        'X-Appwrite-Project': this.client.project,
        'X-Appwrite-Key': this.client.key
      }
    });
    if (!res.ok) throw new Error(await res.text());
    return res.json();
  }

  async createDocument(databaseId: string, collectionId: string, documentId: string, data: any): Promise<any> {
    const res = await fetch(`${this.client.endpoint}/databases/${databaseId}/collections/${collectionId}/documents`, {
      method: 'POST',
      headers: {
        'X-Appwrite-Project': this.client.project,
        'X-Appwrite-Key': this.client.key,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({ documentId, data })
    });
    if (!res.ok) throw new Error(await res.text());
    return res.json();
  }

  async updateDocument(databaseId: string, collectionId: string, documentId: string, data: any): Promise<any> {
    const res = await fetch(`${this.client.endpoint}/databases/${databaseId}/collections/${collectionId}/documents/${documentId}`, {
      method: 'PATCH',
      headers: {
        'X-Appwrite-Project': this.client.project,
        'X-Appwrite-Key': this.client.key,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({ data })
    });
    if (!res.ok) throw new Error(await res.text());
    return res.json();
  }
}

export function getAppwriteClient(env: any) {
  const client = new Client();
  client
    .setEndpoint(env.APPWRITE_ENDPOINT || 'https://cloud.appwrite.io/v1')
    .setProject(env.APPWRITE_PROJECT_ID || 'db')
    .setKey(env.APPWRITE_API_KEY || 'your-api-key');
  return client;
}

export function getDatabases(env: any) {
  return new Databases(getAppwriteClient(env));
}
