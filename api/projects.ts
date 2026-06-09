import { VercelRequest, VercelResponse } from '@vercel/node';
import fs from 'fs';
import path from 'path';
import matter from 'gray-matter';
import { rateLimit } from '../src/rate-limit';

function getProjectsDirectory() {
  return path.join(process.cwd(), "projects");
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
    const projectsDirectory = getProjectsDirectory();
    if (!fs.existsSync(projectsDirectory)) {
      return res.json([]);
    }

    const filenames = fs.readdirSync(projectsDirectory);
    const projects = filenames
      .filter((filename) => filename.endsWith('.md'))
      .map((filename) => {
        const filePath = path.join(projectsDirectory, filename);
        const fileContents = fs.readFileSync(filePath, 'utf8');
        const { data } = matter(fileContents);
        return {
          slug: data.slug || filename.replace('.md', ''),
          title: data.title,
          role: data.role,
          company: data.company,
          period: data.period,
          tags: data.tags || [],
          image: data.image || '',
          metric: data.metric || '',
          order: data.order || 99,
          excerpt: data.excerpt || '',
        };
      })
      .sort((a: any, b: any) => a.order - b.order);

    res.setHeader('Cache-Control', 'public, max-age=300, stale-while-revalidate=3600');
    res.json(projects);
  } catch (error) {
    console.error('Error reading projects:', error);
    res.status(500).json({ error: 'Failed to load projects' });
  }
}
