import fs from 'fs';
import path from 'path';
import matter from 'gray-matter';

const SITE_URL = 'https://maulana.sumbu.xyz';
const POSTS_DIR = path.join(process.cwd(), 'posts');
const PROJECTS_DIR = path.join(process.cwd(), 'projects');

interface SitemapPage {
  url: string;
  priority: string;
  changefreq: string;
  lastmod?: string;
}

function getPostSlugs() {
  if (!fs.existsSync(POSTS_DIR)) return [];
  return fs.readdirSync(POSTS_DIR)
    .filter((filename) => filename.endsWith('.md'))
    .map((filename) => filename.replace('.md', ''));
}

function getProjectSlugs() {
  if (!fs.existsSync(PROJECTS_DIR)) return [];
  return fs.readdirSync(PROJECTS_DIR)
    .filter((filename) => filename.endsWith('.md'))
    .map((filename) => {
      const fileContents = fs.readFileSync(path.join(PROJECTS_DIR, filename), 'utf8');
      const { data } = matter(fileContents);
      return data.slug || filename.replace('.md', '');
    });
}

function getPostData(slug: string) {
  const filePath = path.join(POSTS_DIR, `${slug}.md`);
  if (!fs.existsSync(filePath)) return null;

  const fileContents = fs.readFileSync(filePath, 'utf8');
  const { data } = matter(fileContents);
  return {
    slug,
    date: data.date || new Date().toISOString(),
    modified: data.modified || data.date || new Date().toISOString(),
  };
}

function toIsoDate(value: unknown) {
  if (value instanceof Date) return value.toISOString().slice(0, 10);
  if (typeof value === 'string') {
    const parsed = new Date(value);
    if (!Number.isNaN(parsed.getTime())) return parsed.toISOString().slice(0, 10);
  }
  return new Date().toISOString().slice(0, 10);
}

function generateSitemap() {
  const staticPages: SitemapPage[] = [
    {
      url: '',
      priority: '1.0',
      changefreq: 'weekly',
    },
    {
      url: '/blog',
      priority: '0.9',
      changefreq: 'weekly',
    },
    {
      url: '/projects',
      priority: '0.9',
      changefreq: 'weekly',
    },
  ];

  const postSlugs = getPostSlugs();
  const blogPages = postSlugs.map((slug) => {
    const post = getPostData(slug);
    return {
      url: `/blog/${slug}`,
      priority: '0.8',
      changefreq: 'monthly',
      lastmod: toIsoDate(post?.modified || post?.date),
    };
  });

  const projectSlugs = getProjectSlugs();
  const projectPages: SitemapPage[] = projectSlugs.map((slug) => ({
    url: `/projects/${slug}`,
    priority: '0.8',
    changefreq: 'monthly',
  }));

  const allPages = [...staticPages, ...blogPages, ...projectPages];

  const sitemap = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${allPages
  .map(
    (page) => `  <url>
    <loc>${SITE_URL}${page.url}</loc>${page.lastmod ? `\n    <lastmod>${page.lastmod}</lastmod>` : ''}
    <changefreq>${page.changefreq}</changefreq>
    <priority>${page.priority}</priority>
  </url>`
  )
  .join('\n')}
</urlset>`;

  return sitemap;
}

// Generate sitemap
const sitemap = generateSitemap();

// Write to public directory
const outputPath = path.join(process.cwd(), 'public', 'sitemap.xml');
fs.writeFileSync(outputPath, sitemap, 'utf8');

console.log('✅ Sitemap generated at:', outputPath);
