import { Context, Next } from 'hono';
import { getAuth } from '@clerk/hono';
import { Redis } from '@upstash/redis/cloudflare';
import { Ratelimit } from '@upstash/ratelimit';

export const verifyApiKey = async (c: Context, next: Next) => {
  const apiKey = c.req.header('x-lexrunit-api-key');
  const envKey = c.env.LEXRUNIT_API_KEY || 'default-dev-key';
  if (apiKey !== envKey) {
    return c.json({ detail: 'Invalid API Key' }, 403);
  }
  await next();
}

let redisCache: Redis | null = null;
const getRedis = (env: any) => {
  if (!env.UPSTASH_REDIS_REST_URL || !env.UPSTASH_REDIS_REST_TOKEN) return null;
  if (!redisCache) {
    redisCache = new Redis({
      url: env.UPSTASH_REDIS_REST_URL,
      token: env.UPSTASH_REDIS_REST_TOKEN,
    });
  }
  return redisCache;
}

let ratelimitCache: Ratelimit | null = null;
const localRateLimitMap = new Map<string, { count: number, resetTime: number }>();

export const rateLimiter = async (c: Context, next: Next) => {
  const ip = c.req.header('cf-connecting-ip') || 'unknown';
  
  const redis = getRedis(c.env);
  if (redis) {
    if (!ratelimitCache) {
      ratelimitCache = new Ratelimit({
        redis: redis,
        limiter: Ratelimit.slidingWindow(30, "1 m"), // 30 requests per minute
        analytics: true,
      });
    }

    const { success } = await ratelimitCache.limit(ip);
    if (!success) {
      return c.json({ detail: 'Rate Limit Exceeded. Try again later.' }, 429);
    }
  } else {
    // Local fallback for dev if Redis is missing
    const now = Date.now();
    let record = localRateLimitMap.get(ip);
    if (!record || record.resetTime < now) {
      record = { count: 1, resetTime: now + 60000 };
    } else {
      record.count++;
    }
    localRateLimitMap.set(ip, record);
    
    if (record.count > 30) {
      return c.json({ detail: 'Rate Limit Exceeded. Try again later.' }, 429);
    }
  }
  
  await next();
}

export const cacheMiddleware = (ttlSeconds: number = 300) => async (c: Context, next: Next) => {
  if (c.req.method !== 'GET') {
    return next();
  }

  const redis = getRedis(c.env);
  if (!redis) {
    return next();
  }

  // Include any URL query parameters in cache key
  const cacheKey = `cache:${c.req.url}`;
  
  try {
    const cachedResponse = await redis.get(cacheKey);
    if (cachedResponse) {
      return c.json(cachedResponse);
    }
  } catch (err) {
    console.error("Redis Cache GET Error:", err);
  }

  await next();

  if (c.res.ok && c.res.headers.get('content-type')?.includes('application/json')) {
    try {
      const resClone = c.res.clone();
      const data = await resClone.json();
      
      // Save to cache asynchronously without blocking the response
      c.executionCtx.waitUntil(
        redis.set(cacheKey, data, { ex: ttlSeconds }).catch(err => console.error("Redis Cache SET Error:", err))
      );
    } catch (err) {
      console.error("Failed to parse/cache response:", err);
    }
  }
}

export const requireAuth = async (c: Context, next: Next) => {
  const auth = getAuth(c);
  if (!auth?.userId) {
    console.error('requireAuth failed. auth object:', JSON.stringify(auth));
    return c.json({ detail: 'Unauthorized', debug: auth }, 401);
  }
  await next();
}
