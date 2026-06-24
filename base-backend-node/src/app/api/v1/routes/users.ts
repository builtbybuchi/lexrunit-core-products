import { Hono } from 'hono';
import { getDatabases, DATABASE_ID } from '../../../services/appwriteClient';
import { Query, ID } from 'node-appwrite';
import { Bindings } from '../../../core/types';
import { parsePhoneNumberFromString } from 'libphonenumber-js';
import { getAuth } from '@hono/clerk-auth';

export const usersRouter = new Hono<{ Bindings: Bindings }>();

usersRouter.post('/sync', async (c) => {
  const db = getDatabases(c.env);
  const payload = await c.req.json();
  const auth = getAuth(c);
  const clerkId = auth?.userId;
  
  if (!clerkId) {
    return c.json({ detail: 'Unauthorized' }, 401);
  }
  
  try {
    const res = await db.listDocuments(DATABASE_ID, 'users', [Query.equal('clerk_id', clerkId)]);
    const name = `${payload.first_name || ''} ${payload.last_name || ''}`.trim() || payload.email;
    
    let phoneFormatted = payload.phone;
    if (payload.phone) {
      try {
        const countryCode = payload.country ? payload.country.toUpperCase() : 'NG';
        const phoneNumber = parsePhoneNumberFromString(payload.phone, countryCode as any);
        if (phoneNumber) {
          phoneFormatted = phoneNumber.format('E.164');
          if (phoneFormatted.startsWith('+')) {
            phoneFormatted = phoneFormatted.substring(1);
          }
        }
      } catch (pe) {
        console.error('Phone format error:', pe);
      }
    }
    
    if (res.documents.length) {
      const docId = res.documents[0].$id;
      const updateData: any = { email: payload.email, name };
      if (phoneFormatted) updateData.phone = phoneFormatted;
      const updated = await db.updateDocument(DATABASE_ID, 'users', docId, updateData);
      return c.json(updated);
    } else {
      const createData: any = {
        clerk_id: clerkId,
        email: payload.email,
        name,
        role: 'user',
        settings: '{}'
      };
      if (phoneFormatted) createData.phone = phoneFormatted;
      const newUser = await db.createDocument(DATABASE_ID, 'users', ID.unique(), createData);
      return c.json(newUser);
    }
  } catch (e) {
    console.error(`Error syncing user:`, e);
    return c.json({ detail: 'Failed to sync user' }, 500);
  }
});

usersRouter.get('/settings', async (c) => {
  const db = getDatabases(c.env);
  const auth = getAuth(c);
  const clerkId = auth?.userId;
  if (!clerkId) return c.json({ detail: 'Unauthorized' }, 401);

  try {
    const res = await db.listDocuments(DATABASE_ID, 'users', [Query.equal('clerk_id', clerkId)]);
    if (!res.documents.length) {
      return c.json({ detail: 'User not found' }, 404);
    }
    return c.json(JSON.parse(res.documents[0].settings || '{}'));
  } catch (e) {
    console.error(`Error fetching settings:`, e);
    return c.json({ detail: 'Failed to fetch settings' }, 500);
  }
});

usersRouter.put('/settings', async (c) => {
  const db = getDatabases(c.env);
  const payload = await c.req.json();
  const auth = getAuth(c);
  const clerkId = auth?.userId;
  if (!clerkId) return c.json({ detail: 'Unauthorized' }, 401);

  try {
    const res = await db.listDocuments(DATABASE_ID, 'users', [Query.equal('clerk_id', clerkId)]);
    if (!res.documents.length) {
      return c.json({ detail: 'User not found' }, 404);
    }
    await db.updateDocument(DATABASE_ID, 'users', res.documents[0].$id, { settings: JSON.stringify(payload.settings) });
    return c.json({ status: 'success', settings: payload.settings });
  } catch (e) {
    console.error(`Error updating settings:`, e);
    return c.json({ detail: 'Failed to update settings' }, 500);
  }
});

usersRouter.get('/role', async (c) => {
  const db = getDatabases(c.env);
  const auth = getAuth(c);
  const clerkId = auth?.userId;
  if (!clerkId) return c.json({ detail: 'Unauthorized' }, 401);

  try {
    const res = await db.listDocuments(DATABASE_ID, 'users', [Query.equal('clerk_id', clerkId)]);
    if (res.documents.length) {
      return c.json({ role: res.documents[0].role || 'user' });
    }
    return c.json({ role: 'user' });
  } catch (e) {
    return c.json({ role: 'user' });
  }
});
