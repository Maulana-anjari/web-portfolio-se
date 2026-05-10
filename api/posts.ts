import { VercelRequest, VercelResponse } from '@vercel/node';
import fs from 'fs';
import path from 'path';
import matter from 'gray-matter';

// Helper to resolve posts directory (dev or production)
function getPostsDirectory() {
  let postsDir = path.join(process.cwd(), "posts");
  // In production, posts are copied to dist/posts during build
  if (process.env.NODE_ENV === "production" && !fs.existsSync(postsDir)) {
    postsDir = path.join(process.cwd(), "dist", "posts");
  }
  return postsDir;
}

export default async function handler(req: VercelRequest, res: VercelResponse) {
  if (req.method !== 'GET') {
    return res.status(405).json({ error: 'Method not allowed' });
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
