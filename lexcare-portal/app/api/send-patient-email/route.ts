import { NextRequest } from 'next/server';
import { sendCustomEmail, getPatientWelcomeEmail } from '@/lib/email';

export async function POST(req: NextRequest) {
  try {
    const { full_name, email, password } = await req.json();
    if (!full_name || !email || !password) {
      return new Response(JSON.stringify({ error: 'Missing fields' }), { status: 400 });
    }

    console.log('[Email API] Attempting to send email to:', email);
    console.log('[Email API] SMTP Config:', {
      host: process.env.SMTP_HOST,
      port: process.env.SMTP_PORT,
      user: process.env.SMTP_USER ? 'SET' : 'NOT SET',
      pass: process.env.SMTP_PASS ? 'SET' : 'NOT SET'
    });

    const { subject, text, html } = getPatientWelcomeEmail({ full_name, email, password });
    console.log('[Email API] Email content prepared, sending...');
    await sendCustomEmail({ to: email, subject, text, html });
    console.log('[Email API] Email sent successfully to:', email);

    return new Response(JSON.stringify({ success: true }), { status: 200 });
  } catch (err: any) {
    console.error('[Email API] Error sending email:', err);
    return new Response(JSON.stringify({ error: 'Failed to send email', details: err?.message || 'Unknown error' }), { status: 500 });
  }
} 