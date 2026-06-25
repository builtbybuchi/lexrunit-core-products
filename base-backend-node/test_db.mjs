import { Client, Databases } from 'node-appwrite';
const client = new Client()
    .setEndpoint(process.env.APPWRITE_ENDPOINT)
    .setProject(process.env.APPWRITE_PROJECT_ID)
    .setKey(process.env.APPWRITE_API_KEY);
const db = new Databases(client);
async function test() {
    const col = await db.getCollection('website-db', 'users');
    console.log("Collection Permissions:", col.$permissions);
}
test();
