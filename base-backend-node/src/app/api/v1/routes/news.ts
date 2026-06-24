import { Hono } from 'hono';
import { getDatabases, DATABASE_ID } from '../../../services/appwriteClient';
import { Query } from 'node-appwrite';
import { Bindings } from '../../../core/types';

export const newsRouter = new Hono<{ Bindings: Bindings }>();

newsRouter.get('/', async (c) => {
  const db = getDatabases(c.env);
  try {
    const res = await db.listDocuments(DATABASE_ID, 'news', [Query.orderDesc('publishedAt')]);
    return c.json(res.documents);
  } catch (e) {
    console.error(`Error fetching news:`, e);
    return c.json([]);
  }
});

newsRouter.get('/:slug', async (c) => {
  const db = getDatabases(c.env);
  try {
    const res = await db.listDocuments(DATABASE_ID, 'news', [Query.equal('slug', c.req.param('slug'))]);
    if (res.documents.length) {
      return c.json(res.documents[0]);
    }
    return c.json(null);
  } catch (e) {
    console.error(`Error fetching news article:`, e);
    return c.json(null);
  }
});
