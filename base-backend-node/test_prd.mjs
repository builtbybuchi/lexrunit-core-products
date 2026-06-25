import { Client, Databases, Query } from 'node-appwrite';
const client = new Client()
    .setEndpoint(process.env.APPWRITE_ENDPOINT)
    .setProject(process.env.APPWRITE_PROJECT_ID)
    .setKey(process.env.APPWRITE_API_KEY);
const db = new Databases(client);
async function test() {
    try {
        console.log("Endpoint:", process.env.APPWRITE_ENDPOINT);
        console.log("Project:", process.env.APPWRITE_PROJECT_ID);
        const res = await db.listDocuments('website-db', 'users');
        console.log(`Success! Found ${res.total} users in Production Appwrite`);
    } catch (e) {
        console.error("Failed:", e.message);
    }
}
test();
