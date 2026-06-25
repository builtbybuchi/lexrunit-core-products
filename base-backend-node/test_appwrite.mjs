import { Client, Databases } from 'node-appwrite';
const client = new Client()
    .setEndpoint(process.env.APPWRITE_ENDPOINT)
    .setProject(process.env.APPWRITE_PROJECT_ID)
    .setKey(process.env.APPWRITE_API_KEY);
const db = new Databases(client);
async function test() {
    console.log("Project ID:", process.env.APPWRITE_PROJECT_ID);
    const res = await db.listDocuments('website-db', 'users');
    console.log(res.documents.map(d => ({ name: d.name, email: d.email, clerk_id: d.clerk_id })));
}
test();
