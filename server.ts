import express from "express";
import { createServer as createViteServer } from "vite";
import fs from "fs";
import path from "path";
import matter from "gray-matter";
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Helper to resolve posts directory (dev or production)
function getPostsDirectory() {
  let postsDir = path.join(process.cwd(), "posts");
  // In production, posts are copied to dist/posts during build
  if (process.env.NODE_ENV === "production" && !fs.existsSync(postsDir)) {
    postsDir = path.join(process.cwd(), "dist", "posts");
  }
  return postsDir;
}

async function startServer() {
  const app = express();
  const PORT = 3000;

  // Blog API Routes
  app.get("/api/posts", (req, res) => {
    try {
      const postsDirectory = getPostsDirectory();
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
      res.json(posts);
    } catch (error) {
      console.error("Error reading posts:", error);
      res.status(500).json({ error: "Failed to load posts" });
    }
  });

  app.get("/api/posts/:slug", (req, res) => {
    try {
      const { slug } = req.params;
      const postsDirectory = getPostsDirectory();
      const filePath = path.join(postsDirectory, `${slug}.md`);
      if (!fs.existsSync(filePath)) {
        return res.status(404).json({ error: "Post not found" });
      }
      const fileContents = fs.readFileSync(filePath, "utf8");
      const { data, content } = matter(fileContents);
      res.json({
        slug,
        frontmatter: data,
        content,
      });
    } catch (error) {
      console.error("Error reading post:", error);
      res.status(500).json({ error: "Failed to load post" });
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
    app.get("*", (req, res) => {
      res.sendFile(path.join(distPath, "index.html"));
    });
  }

  app.listen(PORT, "0.0.0.0", () => {
    console.log(`Server running on http://localhost:${PORT}`);
  });
}

startServer();
