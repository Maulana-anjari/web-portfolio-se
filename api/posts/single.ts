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

  const { slug } = req.query;
  
  if (!slug || typeof slug !== 'string') {
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
