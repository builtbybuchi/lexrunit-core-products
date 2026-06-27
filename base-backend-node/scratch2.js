const { Query } = require('node-appwrite');
class Client {
  constructor() { this.endpoint = ''; this.headers = {}; }
  setProject() { return this; }
  setEndpoint() { return this; }
  setKey() { return this; }
  call(method, url, headers, params) { console.log("PARAMS:", params); return Promise.resolve(); }
}
const { Databases } = require('node-appwrite');
const client = new Client();
const db = new Databases(client);
db.listDocuments('db', 'col', [Query.equal('wa_id', '123')]);
