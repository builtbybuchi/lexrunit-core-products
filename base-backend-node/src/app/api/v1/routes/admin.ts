import { Hono } from 'hono';
import { getDatabases, DATABASE_ID } from '../../../services/appwriteClient';
import { Query, ID } from 'node-appwrite';
import { Bindings } from '../../../core/types';
import { getAuth } from '@clerk/hono';

export const adminRouter = new Hono<{ Bindings: Bindings }>();

const verifyAdmin = async (c: any, next: any) => {
  const db = getDatabases(c.env);
  const auth = getAuth(c);
  const clerkId = auth?.userId;
  
  if (!clerkId) {
    return c.json({ detail: 'Not authenticated' }, 401);
  }

  try {
    const res = await db.listDocuments(DATABASE_ID, 'users', [Query.equal('clerk_id', clerkId)]);
    if (!res.documents.length || res.documents[0].role !== 'admin') {
      return c.json({ detail: 'Not authorized as admin' }, 403);
    }
  } catch (e) {
    return c.json({ detail: 'Not authorized as admin' }, 403);
  }
  await next();
}

adminRouter.use('*', verifyAdmin);

adminRouter.get('/collections/:collection_id', async (c) => {
  const db = getDatabases(c.env);
  const colId = c.req.param('collection_id');
  try {
    const res = await db.listDocuments(DATABASE_ID, colId, [Query.orderDesc('$createdAt')]);
    return c.json(res.documents);
  } catch (e) {
    try {
      const fallbackRes = await db.listDocuments(DATABASE_ID, colId);
      return c.json(fallbackRes.documents);
    } catch (e2) {
      console.error(`Error fetching ${colId}:`, e2);
      return c.json([]);
    }
  }
});

adminRouter.delete('/collections/:collection_id/:doc_id', async (c) => {
  const db = getDatabases(c.env);
  await db.deleteDocument(DATABASE_ID, c.req.param('collection_id'), c.req.param('doc_id'));
  return c.json({ status: 'success' });
});

adminRouter.patch('/collections/:collection_id/:doc_id', async (c) => {
  const db = getDatabases(c.env);
  const payload = await c.req.json();
  await db.updateDocument(DATABASE_ID, c.req.param('collection_id'), c.req.param('doc_id'), payload);
  return c.json({ status: 'success' });
});

adminRouter.post('/collections/:collection_id', async (c) => {
  const db = getDatabases(c.env);
  const payload = await c.req.json();
  const doc = await db.createDocument(DATABASE_ID, c.req.param('collection_id'), ID.unique(), payload);
  return c.json(doc);
});
