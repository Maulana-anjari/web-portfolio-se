import { VercelResponse } from '@vercel/node';

interface Bucket {
  count: number;
  resetAt: number;
}

const store = new Map<string, Bucket>();

const WINDOW_MS = 60_000;
const MAX_REQUESTS = 100;

export function checkRateLimit(ip: string, res: VercelResponse): boolean {
  const now = Date.now();
  const bucket = store.get(ip);

  if (!bucket || now > bucket.resetAt) {
    store.set(ip, { count: 1, resetAt: now + WINDOW_MS });
    return true;
  }

  if (bucket.count >= MAX_REQUESTS) {
    res.status(429).json({ error: 'Too many requests, please try again later.' });
    return false;
  }

  bucket.count++;
  return true;
}
