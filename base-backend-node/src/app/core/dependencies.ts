import { Context, Next } from 'hono';

export const verifyApiKey = async (c: Context, next: Next) => {
  const apiKey = c.req.header('x-lexrunit-api-key');
  const envKey = c.env.LEXRUNIT_API_KEY || 'default-dev-key';
  if (apiKey !== envKey) {
    return c.json({ detail: 'Invalid API Key' }, 403);
  }
  await next();
}

const rateLimitMap = new Map<string, { count: number, resetTime: number }>();
const RATE_LIMIT_WINDOW_MS = 60000;
const MAX_REQUESTS_PER_WINDOW = 100;

export const rateLimiter = async (c: Context, next: Next) => {
  const ip = c.req.header('cf-connecting-ip') || 'unknown';
  const now = Date.now();
  let record = rateLimitMap.get(ip);
  if (!record || record.resetTime < now) {
    record = { count: 1, resetTime: now + RATE_LIMIT_WINDOW_MS };
  } else {
    record.count++;
  }
  rateLimitMap.set(ip, record);
  
  if (record.count > MAX_REQUESTS_PER_WINDOW) {
    return c.json({ detail: 'Rate Limit Exceeded' }, 429);
  }
  await next();
}
