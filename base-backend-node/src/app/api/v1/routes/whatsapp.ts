import { Hono } from 'hono';
import { Bindings } from '../../../core/types';
import { getDatabases, DATABASE_ID } from '../../../services/appwriteClient';
import { Query } from 'node-appwrite';

export const whatsappRouter = new Hono<{ Bindings: Bindings }>();

const WA_USERS_COLLECTION = 'whatsapp_users';
const SETTINGS_COLLECTION = 'settings';

whatsappRouter.post('/user-status', async (c) => {
  try {
    const { wa_id, name } = await c.req.json();
    if (!wa_id) return c.json({ error: "Missing WhatsApp ID" }, 400);

    const db = getDatabases(c.env);
    
    // 1. Check if user exists
    let userDoc: any;
    try {
      const response = await db.listDocuments(DATABASE_ID, WA_USERS_COLLECTION, [
        Query.equal("wa_id", wa_id)
      ]);
      if (response.documents.length > 0) {
        userDoc = response.documents[0];
      }
    } catch (err: any) {
      console.warn("Failed to query whatsapp_users collection", err.message);
    }

    let isNewUser = false;
    
    // 2. If user doesn't exist, create a new record
    if (!userDoc) {
      isNewUser = true;
      try {
        userDoc = await db.createDocument(DATABASE_ID, WA_USERS_COLLECTION, 'unique()', {
          wa_id: wa_id,
          name: name || 'Unknown',
          question_count: 0,
          is_subscribed: false,
          is_registered: false
        });
      } catch (err: any) {
        userDoc = { wa_id, question_count: 0, is_subscribed: false, is_registered: false };
      }
    }

    // 3. Generate Checkout URL if not subscribed
    let checkoutUrl = "https://lexrunit.com/subscribe"; // default fallback
    if (!userDoc.is_subscribed) {
      try {
        // Fetch price from settings
        let price = 5000; // default 5000 NGN
        try {
           const settingsRes = await db.listDocuments(DATABASE_ID, SETTINGS_COLLECTION, [
             Query.equal("key", "subscription_price")
           ]);
           if (settingsRes.documents.length > 0) {
              price = parseInt(settingsRes.documents[0].value, 10);
           }
        } catch(e) { /* ignore */ }

        // Squadco API
        if (c.env.SQUADCO_BASE_URL && c.env.SQUADCO_SECRET_KEY) {
          const squadResponse = await fetch(`${c.env.SQUADCO_BASE_URL}/transaction/initiate`, {
            method: 'POST',
            headers: {
              'Authorization': `Bearer ${c.env.SQUADCO_SECRET_KEY}`,
              'Content-Type': 'application/json'
            },
            body: JSON.stringify({
              amount: price * 100, // Squadco uses kobo
              email: `${wa_id}@whatsapp.lexrunit.com`, // Dummy email required by gateway
              currency: "NGN",
              initiate_type: "inline",
              transaction_ref: `sub_${wa_id}_${Date.now()}`,
              callback_url: `${c.env.APP_URL || 'https://lexrunit.com'}/payment-callback`
            })
          });
          const squadData: any = await squadResponse.json();
          if (squadData?.data?.checkout_url) {
            checkoutUrl = squadData.data.checkout_url;
          }
        }
      } catch (err) {
        console.error("Squadco error:", err);
      }
    }

    return c.json({
      exists: !isNewUser, // Is it their very first time messaging?
      isRegistered: userDoc.is_registered || false, // Have they signed up on the website?
      questionCount: userDoc.question_count || 0,
      isSubscribed: userDoc.is_subscribed || false,
      checkoutUrl
    }, 200);

  } catch (error: any) {
    console.error("WhatsApp Status Error:", error);
    return c.json({ success: false, error: error.message }, 500);
  }
});

whatsappRouter.post('/increment-question', async (c) => {
  try {
    const { wa_id } = await c.req.json();
    const db = getDatabases(c.env);
    
    const response = await db.listDocuments(DATABASE_ID, WA_USERS_COLLECTION, [
      Query.equal("wa_id", wa_id)
    ]);
    
    if (response.documents.length > 0) {
      const doc = response.documents[0];
      await db.updateDocument(DATABASE_ID, WA_USERS_COLLECTION, doc.$id, {
        question_count: (doc.question_count || 0) + 1
      });
    }
    
    return c.json({ success: true }, 200);
  } catch (error: any) {
    return c.json({ success: false, error: error.message }, 500);
  }
});

// Squadco Webhook to verify payment
whatsappRouter.post('/squad-webhook', async (c) => {
  try {
    // Implement squad signature verification here if needed
    const payload = await c.req.json();
    
    // We expect the transaction_ref to contain the wa_id: sub_WAID_TIMESTAMP
    if (payload?.Event === 'charge.completed' && payload?.Body?.transaction_ref?.startsWith('sub_')) {
      const parts = payload.Body.transaction_ref.split('_');
      if (parts.length >= 2) {
        const wa_id = parts[1];
        
        const db = getDatabases(c.env);
        const response = await db.listDocuments(DATABASE_ID, WA_USERS_COLLECTION, [
          Query.equal("wa_id", wa_id)
        ]);
        
        if (response.documents.length > 0) {
          const doc = response.documents[0];
          await db.updateDocument(DATABASE_ID, WA_USERS_COLLECTION, doc.$id, {
            is_subscribed: true
          });
        }
      }
    }
    return c.json({ success: true }, 200);
  } catch (error: any) {
    console.error("Squad webhook error:", error);
    return c.json({ success: false }, 500);
  }
});

// Endpoint to mark user as registered from WhatsApp Flow
whatsappRouter.post('/register', async (c) => {
  try {
    const { wa_id, name } = await c.req.json();
    const db = getDatabases(c.env);
    
    const response = await db.listDocuments(DATABASE_ID, WA_USERS_COLLECTION, [
      Query.equal("wa_id", wa_id)
    ]);
    
    if (response.documents.length > 0) {
      const doc = response.documents[0];
      await db.updateDocument(DATABASE_ID, WA_USERS_COLLECTION, doc.$id, {
        is_registered: true,
        name: name || doc.name
      });
    }
    
    return c.json({ success: true }, 200);
  } catch (error: any) {
    console.error("WhatsApp Register Error:", error);
    return c.json({ success: false, error: error.message }, 500);
  }
});
