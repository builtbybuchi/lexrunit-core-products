const { Client, Databases, Query } = require('node-appwrite');
const client = new Client().setEndpoint('https://cloud.appwrite.io/v1').setProject('test');
const db = new Databases(client);
const req = db.listDocuments('db', 'col', [Query.equal('wa_id', '123')]);
req.catch(e => {
  // We expect it to fail, but we can intercept the request or look at the error to see what URL was requested
  console.log(e.response?.url || e.message);
})
