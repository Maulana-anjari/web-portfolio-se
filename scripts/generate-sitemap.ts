import fs from 'fs';
import path from 'path';
import matter from 'gray-matter';

const SITE_URL = 'https://maulana.sumbu.xyz';
const POSTS_DIR = path.join(process.cwd(), 'posts');

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
  ];

  const postSlugs = getPostSlugs();
  const blogPages = postSlugs.map((slug) => {
    const post = getPostData(slug);
    return {
      url: `/blog/${slug}`,
      priority: '0.8',
      changefreq: 'monthly',
      lastmod: post?.modified || post?.date || new Date().toISOString(),
    };
  });

  const allPages = [...staticPages, ...blogPages];

  const sitemap = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${allPages
  .map(
    (page) => `  <url>
    <loc>${SITE_URL}${page.url}</loc>
    ${page.lastmod ? `<lastmod>${page.lastmod}</lastmod>` : ''}
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