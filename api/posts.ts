import { VercelRequest, VercelResponse } from '@vercel/node';
import fs from 'fs';
import path from 'path';
import matter from 'gray-matter';
import { rateLimit } from './rate-limit';

// Helper to resolve posts directory (Vercel deployment)
function getPostsDirectory() {
  return path.join(process.cwd(), "posts");
}

function getClientIp(req: VercelRequest): string {
  const forwarded = req.headers['x-forwarded-for'];
  if (typeof forwarded === 'string') return forwarded.split(',')[0].trim();
  if (Array.isArray(forwarded)) return forwarded[0].split(',')[0].trim();
  return req.socket.remoteAddress || 'unknown';
}

export default async function handler(req: VercelRequest, res: VercelResponse) {
  if (req.method !== 'GET') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  if (!rateLimit(getClientIp(req))) {
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

    res.setHeader('Cache-Control', 'public, max-age=300, stale-while-revalidate=3600');
    res.json(posts);
  } catch (error) {
    console.error('Error reading posts:', error);
    res.status(500).json({ error: 'Failed to load posts' });
  }
}
