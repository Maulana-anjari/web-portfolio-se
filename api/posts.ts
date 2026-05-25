import { VercelRequest, VercelResponse } from '@vercel/node';
import fs from 'fs';
import path from 'path';
import matter from 'gray-matter';

function getPostsDirectory() {
  return path.join(process.cwd(), "posts");
}

function getClientIp(req: VercelRequest): string {
  const forwarded = req.headers['x-forwarded-for'];
  if (typeof forwarded === 'string') return forwarded.split(',')[0].trim();
  if (Array.isArray(forwarded)) return forwarded[0].split(',')[0].trim();
  return req.socket.remoteAddress || 'unknown';
}

const rateStore = new Map<string, { count: number; resetAt: number }>();
function checkRate(key: string, max = 100, windowMs = 60_000): boolean {
  const now = Date.now();
  const entry = rateStore.get(key);
  if (!entry || now > entry.resetAt) {
    rateStore.set(key, { count: 1, resetAt: now + windowMs });
    return true;
  }
  if (entry.count >= max) return false;
  entry.count++;
  return true;
}

export default async function handler(req: VercelRequest, res: VercelResponse) {
  if (req.method !== 'GET') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  if (!checkRate(getClientIp(req))) {
    return res.status(429).json({ error: 'Too many requests' });
  }

  try {
    const postsDirectory = getPostsDirectory();
    if (!fs.existsSync(postsDirectory)) {
      return res.json([]);
    }

    const filenames = fs.readdirSync(postsDirectory);
    const posts = filenames
      .filter((filename) => filename.endsWith('.md'))
      .map((filename) => {
        const filePath = path.join(postsDirectory, filename);
        const fileContents = fs.readFileSync(filePath, 'utf8');
        const { data } = matter(fileContents);
        return {
          slug: filename.replace('.md', ''),
          ...data,
        };
      })
      .sort((a: any, b: any) => (new Date(b.date).getTime() - new Date(a.date).getTime()));

    // Optional pagination: /api/posts?page=1&limit=10
    const page = parseInt(req.query.page as string, 10);
    const limit = parseInt(req.query.limit as string, 10);

    res.setHeader('Cache-Control', 'public, max-age=300, stale-while-revalidate=3600');

    if (!isNaN(page) && !isNaN(limit) && page > 0 && limit > 0) {
      const total = posts.length;
      const start = (page - 1) * limit;
      const paginated = posts.slice(start, start + limit);
      res.json({ posts: paginated, total, page, limit });
    } else {
      res.json(posts);
    }
  } catch (error) {
    console.error('Error reading posts:', error);
    res.status(500).json({ error: 'Failed to load posts' });
  }
}
