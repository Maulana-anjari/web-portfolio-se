import express from "express";
import { createServer as createViteServer } from "vite";
import fs from "fs";
import path from "path";
import matter from "gray-matter";
import { rateLimit } from './src/rate-limit';

// Rate limit middleware for Express
function rateLimitMiddleware(req: express.Request, res: express.Response, next: express.NextFunction) {
  const ip = req.ip || req.socket.remoteAddress || 'unknown';
  if (!rateLimit(ip)) {
    res.status(429).json({ error: 'Too many requests' });
    return;
  }
  next();
}

function securityHeadersMiddleware(_req: express.Request, res: express.Response, next: express.NextFunction) {
  const isDev = process.env.NODE_ENV !== 'production';
  res.setHeader(
    'Content-Security-Policy',
    `default-src 'self'; script-src 'self' 'unsafe-inline' https://giscus.app; style-src 'self' 'unsafe-inline' https://fonts.googleapis.com; font-src 'self' https://fonts.gstatic.com; img-src 'self' https: data:; connect-src 'self' https:${isDev ? ' ws:' : ''}; frame-src 'self' https://giscus.app; frame-ancestors 'self'; base-uri 'self'; object-src 'none'; form-action 'self'`,
  );
  res.setHeader('Strict-Transport-Security', 'max-age=63072000; includeSubDomains; preload');
  res.setHeader('X-Frame-Options', 'SAMEORIGIN');
  res.setHeader('Cross-Origin-Opener-Policy', 'same-origin-allow-popups');
  res.setHeader('X-Content-Type-Options', 'nosniff');
  res.setHeader('Referrer-Policy', 'strict-origin-when-cross-origin');
  res.setHeader('Permissions-Policy', 'camera=(), microphone=(), geolocation=(), payment=()');
  next();
}

// Helper to resolve content directories (dev or production)
function getContentDir(name: string) {
  let dir = path.join(process.cwd(), name);
  if (process.env.NODE_ENV === "production" && !fs.existsSync(dir)) {
    dir = path.join(process.cwd(), "dist", name);
  }
  return dir;
}

function getPostsDirectory() {
  return getContentDir("posts");
}

function getProjectsDirectory() {
  return getContentDir("projects");
}

async function startServer() {
  const app = express();
  const PORT = 3000;

  app.use(securityHeadersMiddleware);

  // Blog API Routes
  app.get("/api/posts", rateLimitMiddleware, (req, res) => {
    try {
      const postsDirectory = getPostsDirectory();

      // Query param detail: /api/posts?slug=foo
      const slug = req.query.slug as string | undefined;
      if (slug) {
        if (!/^[a-zA-Z0-9_-]+$/.test(slug)) {
          return res.status(400).json({ error: 'Invalid slug' });
        }
        const filePath = path.join(postsDirectory, `${slug}.md`);
        if (!fs.existsSync(filePath)) {
          return res.status(404).json({ error: "Post not found" });
        }
        const fileContents = fs.readFileSync(filePath, "utf8");
        const { data, content } = matter(fileContents);
        return res.json({ slug, frontmatter: data, content });
      }

      // List all posts
      if (!fs.existsSync(postsDirectory)) {
        return res.json([]);
      }
      const filenames = fs.readdirSync(postsDirectory);
      const posts = filenames
        .filter((filename) => filename.endsWith(".md"))
        .map((filename) => {
          const filePath = path.join(postsDirectory, filename);
          const fileContents = fs.readFileSync(filePath, "utf8");
          const { data } = matter(fileContents);
          return {
            slug: filename.replace(".md", ""),
            ...data,
          };
        })
        .sort((a: any, b: any) => (new Date(b.date).getTime() - new Date(a.date).getTime()));

      // Optional pagination: /api/posts?page=1&limit=10
      const page = parseInt(req.query.page as string, 10);
      const limit = parseInt(req.query.limit as string, 10);

      if (!isNaN(page) && !isNaN(limit) && page > 0 && limit > 0) {
        const total = posts.length;
        const start = (page - 1) * limit;
        const paginated = posts.slice(start, start + limit);
        res.json({ posts: paginated, total, page, limit });
      } else {
        res.json(posts);
      }
    } catch (error) {
      console.error("Error reading posts:", error);
      res.status(500).json({ error: "Failed to load posts" });
    }
  });

  // Project API Routes
  app.get("/api/projects", rateLimitMiddleware, (req, res) => {
    try {
      const projectsDirectory = getProjectsDirectory();
      if (!fs.existsSync(projectsDirectory)) {
        return res.json([]);
      }
      const files = fs.readdirSync(projectsDirectory).filter(f => f.endsWith(".md"));

      // Query param detail: /api/projects?slug=foo
      const slug = req.query.slug as string | undefined;
      if (slug) {
        if (!/^[a-zA-Z0-9_-]+$/.test(slug)) {
          return res.status(400).json({ error: 'Invalid slug' });
        }
        for (const file of files) {
          const filePath = path.join(projectsDirectory, file);
          const fileContents = fs.readFileSync(filePath, "utf8");
          const { data, content } = matter(fileContents);
          if (data.slug === slug || file.replace(".md", "") === slug) {
            return res.json({
              slug: data.slug || file.replace(".md", ""),
              title: data.title,
              role: data.role,
              company: data.company,
              period: data.period,
              tags: data.tags || [],
              image: data.image || "",
              metric: data.metric || "",
              content,
            });
          }
        }
        return res.status(404).json({ error: "Project not found" });
      }

      // List all projects
      const projects = files
        .map((filename) => {
          const filePath = path.join(projectsDirectory, filename);
          const fileContents = fs.readFileSync(filePath, "utf8");
          const { data } = matter(fileContents);
          return {
            slug: data.slug || filename.replace(".md", ""),
            title: data.title,
            role: data.role,
            company: data.company,
            period: data.period,
            tags: data.tags || [],
            image: data.image || "",
            metric: data.metric || "",
            order: data.order || 99,
            excerpt: data.excerpt || "",
          };
        })
        .sort((a: any, b: any) => a.order - b.order);

      res.json(projects);
    } catch (error) {
      console.error("Error reading projects:", error);
      res.status(500).json({ error: "Failed to load projects" });
    }
  });

  // Vite middleware for development
  if (process.env.NODE_ENV !== "production") {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: "spa",
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), "dist");
    app.use(express.static(distPath));
    app.get("*", (_req, res) => {
      res.sendFile(path.join(distPath, "index.html"));
    });
  }

  app.listen(PORT, "0.0.0.0", () => {
    console.log(`Server running on http://localhost:${PORT}`);
  });
}

startServer();
