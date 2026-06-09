import { VercelRequest, VercelResponse } from '@vercel/node';
import fs from 'fs';
import path from 'path';
import matter from 'gray-matter';
import { rateLimit } from '../_lib/rate-limit';

function getProjectsDirectory() {
  const dir = path.join(process.cwd(), "projects");
  if (!fs.existsSync(dir)) return path.join(process.cwd(), "dist", "projects");
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

  if (!/^[a-zA-Z0-9_-]+$/.test(slug)) {
    return res.status(400).json({ error: 'Invalid slug' });
  }

  try {
    const projectsDirectory = getProjectsDirectory();
    const files = fs.readdirSync(projectsDirectory).filter(f => f.endsWith('.md'));

    for (const file of files) {
      const raw = fs.readFileSync(path.join(projectsDirectory, file), 'utf-8');
      const { data, content } = matter(raw);
      if (data.slug === slug || file.replace('.md', '') === slug) {
        res.setHeader('Cache-Control', 'public, max-age=300, stale-while-revalidate=3600');
        return res.json({
          slug: data.slug || file.replace('.md', ''),
          title: data.title,
          role: data.role,
          company: data.company,
          period: data.period,
          tags: data.tags || [],
          image: data.image || '',
          metric: data.metric || '',
          content,
        });
      }
    }

    return res.status(404).json({ error: 'Project not found' });
  } catch (error) {
    console.error('Error reading project:', error);
    res.status(500).json({ error: 'Failed to load project' });
  }
}
