import { VercelRequest, VercelResponse } from '@vercel/node';
import matter from 'gray-matter';
import fs from 'fs';
import path from 'path';

export default async function handler(req: VercelRequest, res: VercelResponse) {
  const hasGrayMatter = typeof matter === 'function';
  const hasFs = typeof fs.readFileSync === 'function';
  const cwd = process.cwd();
  const cwdFiles = fs.readdirSync(cwd);
  const hasPosts = cwdFiles.includes('posts');
  
  let postsDir = path.join(cwd, 'posts');
  let postsExist = false;
  try { postsExist = fs.existsSync(postsDir); } catch(e) {}

  res.json({ ok: true, hasGrayMatter, hasFs, hasPosts, postsExist, cwd, cwdFiles });
}
