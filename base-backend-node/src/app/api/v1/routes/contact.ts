import { Hono } from 'hono';
import { getDatabases, DATABASE_ID } from '../../../services/appwriteClient';
import { ID } from 'node-appwrite';
import { Bindings } from '../../../core/types';

export const contactRouter = new Hono<{ Bindings: Bindings }>();

contactRouter.post('/', async (c) => {
  const db = getDatabases(c.env);
  const form = await c.req.json();
  
  try {
    await db.createDocument(DATABASE_ID, 'contacts', ID.unique(), form);
  } catch (e) {
    console.error('Failed to save contact form to DB:', e);
  }
  
  try {
    const resendApiKey = c.env.RESEND_API_KEY;
    if (!resendApiKey) {
      console.warn("Warning: RESEND_API_KEY is not set.");
    } else {
      const emailHtml = `
        <h2>New Contact Form Submission</h2>
        <p><strong>Name:</strong> ${form.name}</p>
        <p><strong>Email:</strong> ${form.email}</p>
        <p><strong>Subject:</strong> ${form.subject}</p>
        <hr>
        <p>${form.message.replace(/\n/g, '<br>')}</p>
      `;

      const fromEmail = c.env.RESEND_FROM_EMAIL || 'onboarding@resend.dev';
      const toEmail = 'tickets@lexrunit.p.tawk.email';

      const res = await fetch('https://api.resend.com/emails', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${resendApiKey}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          from: fromEmail,
          to: [toEmail],
          subject: `Contact Form: ${form.subject}`,
          reply_to: form.email,
          html: emailHtml
        })
      });
      const resData = await res.json();
      console.log('Resend response:', resData);
    }
            
    return c.json({ status: 'success', message: 'Contact form submitted' });
  } catch (e) {
    console.error(`Error sending email:`, e);
    return c.json({ detail: 'Failed to process contact submission' }, 500);
  }
});
