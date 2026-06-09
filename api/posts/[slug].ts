import { VercelRequest, VercelResponse } from '@vercel/node';
import fs from 'fs';
import path from 'path';
import matter from 'gray-matter';
import { rateLimit } from '../_lib/rate-limit';

function getPostsDirectory() {
  const dir = path.join(process.cwd(), "posts");
  if (!fs.existsSync(dir)) return path.join(process.cwd(), "dist", "posts");
  return dir;
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

  const { slug } = req.query;

  if (!slug || typeof slug !== 'string') {
    return res.status(400).json({ error: 'Invalid slug' });
  }

  // Prevent path traversal: only allow alphanumeric, dash, and underscore
  if (!/^[a-zA-Z0-9_-]+$/.test(slug)) {
    return res.status(400).json({ error: 'Invalid slug' });
  }

  try {
    const postsDirectory = getPostsDirectory();
    const filePath = path.join(postsDirectory, `${slug}.md`);
    
    if (!fs.existsSync(filePath)) {
      return res.status(404).json({ error: 'Post not found' });
    }

    const fileContents = fs.readFileSync(filePath, 'utf8');
    const { data, content } = matter(fileContents);

    res.setHeader('Cache-Control', 'public, max-age=300, stale-while-revalidate=3600');
    res.json({
      slug,
      frontmatter: data,
      content,
    });
  } catch (error) {
    console.error('Error reading post:', error);
    res.status(500).json({ error: 'Failed to load post' });
  }
}
