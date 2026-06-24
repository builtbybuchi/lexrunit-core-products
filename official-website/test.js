import { Client, Databases } from 'node-appwrite';
const client = new Client()
    .setEndpoint('https://fra.cloud.appwrite.io/v1')
    .setProject('lexrunit-general-db');
const db = new Databases(client);
db.listDocuments('website-db', 'blogs').then(console.log).catch(e => console.error(e));
