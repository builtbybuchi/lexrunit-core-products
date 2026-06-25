import { Query, ID } from 'node-appwrite';
console.log(Query.equal('slug', 'test'));
console.log(Query.orderDesc('publishedAt'));
console.log(ID.unique());
