import { VercelRequest, VercelResponse } from '@vercel/node';
import fs from 'fs';
import path from 'path';
import matter from 'gray-matter';
import { checkRateLimit } from './_lib/rateLimit';

function getProjectsDirectory() {
  const dir = path.join(process.cwd(), "projects");
  if (!fs.existsSync(dir)) return path.join(process.cwd(), "dist", "projects");
  return dir;
}

export default async function handler(req: VercelRequest, res: VercelResponse) {
  if (req.method !== 'GET') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  const ip = (req.headers['x-forwarded-for'] as string || req.socket.remoteAddress || 'unknown').split(',')[0].trim();
  if (!checkRateLimit(ip, res)) return;

  try {
    const projectsDirectory = getProjectsDirectory();
    if (!fs.existsSync(projectsDirectory)) {
      return res.json([]);
    }

    const files = fs.readdirSync(projectsDirectory).filter(f => f.endsWith('.md'));

    const slug = req.query.slug as string | undefined;

    // Single project detail: /api/projects?slug=foo
    if (slug) {
      if (!/^[a-zA-Z0-9_-]+$/.test(slug)) {
        return res.status(400).json({ error: 'Invalid slug' });
      }
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
            status: data.status || '',
            content,
          });
        }
      }
      return res.status(404).json({ error: 'Project not found' });
    }

    // List all projects
    const projects = files
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
          status: data.status || '',
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
