import { VercelRequest, VercelResponse } from '@vercel/node';
import matter from 'gray-matter';
import fs from 'fs';
import path from 'path';
import { rateLimit } from '../src/rate-limit';

export default async function handler(req: VercelRequest, res: VercelResponse) {
  const testFile = path.join(process.cwd(), 'posts', 'backend-super-skills-ai-agents.md');
  const fileExists = fs.existsSync(testFile);
  let parsed: any = null;
  if (fileExists) {
    const raw = fs.readFileSync(testFile, 'utf-8');
    parsed = matter(raw).data.title || 'no title';
  }
  const hasRateLimit = typeof rateLimit === 'function';
  res.json({ ok: true, fileExists, parsed, hasRateLimit });
}
