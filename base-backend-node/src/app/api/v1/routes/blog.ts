import { Hono } from 'hono';
import { getDatabases, DATABASE_ID } from '../../../services/appwriteClient';
import { Query } from 'node-appwrite';
import { Bindings } from '../../../core/types';

export const blogRouter = new Hono<{ Bindings: Bindings }>();

blogRouter.get('/', async (c) => {
  const db = getDatabases(c.env);
  try {
    const res = await db.listDocuments(DATABASE_ID, 'blogs', [Query.orderDesc('publishedAt')]);
    return c.json(res.documents);
  } catch (e) {
    console.error(`Error fetching blogs:`, e);
    return c.json([]);
  }
});

blogRouter.get('/:slug', async (c) => {
  const db = getDatabases(c.env);
  try {
    const res = await db.listDocuments(DATABASE_ID, 'blogs', [Query.equal('slug', c.req.param('slug'))]);
    if (res.documents.length) {
      return c.json(res.documents[0]);
    }
    return c.json(null);
  } catch (e) {
    console.error(`Error fetching blog post:`, e);
    return c.json(null);
  }
});
