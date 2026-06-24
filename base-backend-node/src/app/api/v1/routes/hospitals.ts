import { Hono } from 'hono';
import { getDatabases, DATABASE_ID } from '../../../services/appwriteClient';
import { Query } from 'node-appwrite';
import { Bindings } from '../../../core/types';

export const hospitalsRouter = new Hono<{ Bindings: Bindings }>();

hospitalsRouter.get('/', async (c) => {
  const db = getDatabases(c.env);
  const state = c.req.query('state');
  const city = c.req.query('city');
  const product = c.req.query('product');
  const queries = [];
  
  if (state) queries.push(Query.equal('state', state));
  if (city) queries.push(Query.equal('city', city));
  if (product) queries.push(Query.search('products', product));
  
  try {
    const res = await db.listDocuments(DATABASE_ID, 'hospitals', queries);
    return c.json(res.documents);
  } catch (e) {
    console.error(`Error fetching hospitals:`, e);
    return c.json([]);
  }
});
