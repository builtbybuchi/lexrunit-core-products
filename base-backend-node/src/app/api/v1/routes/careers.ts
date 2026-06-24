import { Hono } from 'hono';
import { getDatabases, DATABASE_ID } from '../../../services/appwriteClient';
import { Query } from 'node-appwrite';
import { Bindings } from '../../../core/types';

export const careersRouter = new Hono<{ Bindings: Bindings }>();

careersRouter.get('/', async (c) => {
  const db = getDatabases(c.env);
  try {
    const res = await db.listDocuments(DATABASE_ID, 'jobs', [Query.orderDesc('publishedAt')]);
    return c.json(res.documents);
  } catch (e) {
    console.error(`Error fetching careers:`, e);
    return c.json([]);
  }
});
