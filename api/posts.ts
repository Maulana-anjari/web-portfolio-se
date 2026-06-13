import { VercelRequest, VercelResponse } from '@vercel/node';
import fs from 'fs';
import path from 'path';
import matter from 'gray-matter';
import { checkRateLimit } from './_lib/rateLimit';

function getPostsDirectory() {
  const dir = path.join(process.cwd(), "posts");
  if (!fs.existsSync(dir)) return path.join(process.cwd(), "dist", "posts");
  return dir;
}

export default async function handler(req: VercelRequest, res: VercelResponse) {
  if (req.method !== 'GET') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  const ip = (req.headers['x-forwarded-for'] as string || req.socket.remoteAddress || 'unknown').split(',')[0].trim();
  if (!checkRateLimit(ip, res)) return;

  try {
    const postsDirectory = getPostsDirectory();
    if (!fs.existsSync(postsDirectory)) {
      return res.json([]);
    }

    const slug = req.query.slug as string | undefined;

    // Single post detail: /api/posts?slug=foo
    if (slug) {
      if (!/^[a-zA-Z0-9_-]+$/.test(slug)) {
        return res.status(400).json({ error: 'Invalid slug' });
      }
      const filePath = path.join(postsDirectory, `${slug}.md`);
      if (!fs.existsSync(filePath)) {
        return res.status(404).json({ error: 'Post not found' });
      }
      const fileContents = fs.readFileSync(filePath, 'utf8');
      const { data, content } = matter(fileContents);
      res.setHeader('Cache-Control', 'public, max-age=300, stale-while-revalidate=3600');
      return res.json({ slug, frontmatter: data, content });
    }

    // List all posts
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
