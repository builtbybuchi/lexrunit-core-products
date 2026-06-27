import { Hono } from 'hono';
import { getDatabases, DATABASE_ID } from '../../../services/appwriteClient';
import { Query, ID } from 'node-appwrite';
import { Bindings } from '../../../core/types';
import { parsePhoneNumberFromString } from 'libphonenumber-js';
import { getAuth } from '@clerk/hono';

export const usersRouter = new Hono<{ Bindings: Bindings }>();

usersRouter.get('/test-appwrite', async (c) => {
  try {
    const db = getDatabases(c.env);
    const res = await db.listDocuments(DATABASE_ID, 'users');
    return c.json({ success: true, count: res.total, docs: res.documents });
  } catch (e: any) {
    return c.json({ success: false, error: e.message, code: e.code, stack: e.stack }, 500);
  }
});

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
    
    let settingsObj = JSON.parse(res.documents[0].settings || '{}');
    if (!settingsObj.products) settingsObj.products = [];
    
    // Dynamically inject Dr. Andre if the user has talked to the bot
    const phone = res.documents[0].phone;
    if (phone) {
      const waUser = await db.listDocuments(DATABASE_ID, 'whatsapp_users', [Query.equal('wa_id', phone)]);
      if (waUser.documents.length > 0 && !settingsObj.products.includes('dr-andre')) {
        settingsObj.products.push('dr-andre');
      }
    }
    
    return c.json(settingsObj);
  } catch (e) {
    console.error(`Error fetching settings:`, e);
    return c.json({ detail: 'Failed to fetch settings' }, 500);
  }
});

usersRouter.post('/request-verification', async (c) => {
  const db = getDatabases(c.env);
  const payload = await c.req.json();
  const auth = getAuth(c);
  const clerkId = auth?.userId;
  if (!clerkId) return c.json({ detail: 'Unauthorized' }, 401);
  
  if (!payload.phone) return c.json({ detail: 'Phone is required' }, 400);

  try {
    // Standardize phone
    let phoneFormatted = payload.phone;
    try {
      const countryCode = payload.country ? payload.country.toUpperCase() : 'NG';
      const phoneNumber = parsePhoneNumberFromString(payload.phone, countryCode as any);
      if (phoneNumber) {
        phoneFormatted = phoneNumber.format('E.164');
        if (phoneFormatted.startsWith('+')) phoneFormatted = phoneFormatted.substring(1);
      }
    } catch (pe) {
      // ignore
    }

    const res = await db.listDocuments(DATABASE_ID, 'users', [Query.equal('clerk_id', clerkId)]);
    if (!res.documents.length) {
      return c.json({ detail: 'User not found' }, 404);
    }
    
    const userDoc = res.documents[0];
    const settingsObj = JSON.parse(userDoc.settings || '{}');
    
    // Generate 6 digit OTP
    const otp = Math.floor(100000 + Math.random() * 900000).toString();
    
    settingsObj.pending_phone = phoneFormatted;
    settingsObj.otp = otp;
    settingsObj.otp_expiry = Date.now() + 10 * 60 * 1000; // 10 minutes
    
    await db.updateDocument(DATABASE_ID, 'users', userDoc.$id, { settings: JSON.stringify(settingsObj) });
    
    // Send to WhatsApp Bot
    await fetch('https://lexcare-whatsapp-bot.onrender.com/api/v1/whatsapp/send-otp', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ wa_id: phoneFormatted, code: otp })
    });
    
    return c.json({ success: true, message: 'OTP sent via WhatsApp' });
  } catch (e) {
    console.error(`Error requesting verification:`, e);
    return c.json({ detail: 'Failed to send verification code' }, 500);
  }
});

usersRouter.post('/verify-phone', async (c) => {
  const db = getDatabases(c.env);
  const payload = await c.req.json();
  const auth = getAuth(c);
  const clerkId = auth?.userId;
  if (!clerkId) return c.json({ detail: 'Unauthorized' }, 401);
  
  if (!payload.code) return c.json({ detail: 'Code is required' }, 400);

  try {
    const res = await db.listDocuments(DATABASE_ID, 'users', [Query.equal('clerk_id', clerkId)]);
    if (!res.documents.length) return c.json({ detail: 'User not found' }, 404);
    
    const userDoc = res.documents[0];
    const settingsObj = JSON.parse(userDoc.settings || '{}');
    
    if (!settingsObj.otp || !settingsObj.pending_phone) {
      return c.json({ detail: 'No pending verification' }, 400);
    }
    
    if (Date.now() > settingsObj.otp_expiry) {
      return c.json({ detail: 'Verification code expired' }, 400);
    }
    
    if (settingsObj.otp !== payload.code) {
      return c.json({ detail: 'Invalid verification code' }, 400);
    }
    
    // Success! Update phone and clean up settings
    const newPhone = settingsObj.pending_phone;
    delete settingsObj.otp;
    delete settingsObj.otp_expiry;
    delete settingsObj.pending_phone;
    
    await db.updateDocument(DATABASE_ID, 'users', userDoc.$id, { 
      phone: newPhone,
      settings: JSON.stringify(settingsObj) 
    });
    
    return c.json({ success: true, phone: newPhone });
  } catch (e) {
    console.error(`Error verifying phone:`, e);
    return c.json({ detail: 'Failed to verify phone' }, 500);
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
