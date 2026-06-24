import { Hono } from 'hono';
import { getDatabases, DATABASE_ID } from '../../../services/appwriteClient';
import { Query } from 'node-appwrite';
import { Bindings } from '../../../core/types';

export const higsRouter = new Hono<{ Bindings: Bindings }>();

higsRouter.get('/events/latest', async (c) => {
  const db = getDatabases(c.env);
  try {
    const res = await db.listDocuments(DATABASE_ID, 'higs_events', [
      Query.equal('isActive', true),
      Query.orderDesc('$createdAt'),
      Query.limit(1)
    ]);
    if (res.documents.length) {
      return c.json({
        date: res.documents[0].date,
        registrationUrl: res.documents[0].registrationUrl
      });
    }
    return c.json({
      date: 'TBA',
      registrationUrl: 'https://luma.com/oyyhm42g'
    });
  } catch (e) {
    console.error(`Error fetching HIGS event:`, e);
    return c.json({
      date: 'TBA',
      registrationUrl: 'https://luma.com/oyyhm42g'
    });
  }
});
