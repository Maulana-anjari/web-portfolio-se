# Blog Post Writer

Write new blog posts for this portfolio site that match the existing conventions exactly.

## Trigger

Use this skill when the user asks to write, create, or draft a new blog post.

## Before writing

1. Read 2-3 existing posts in `posts/` to internalize voice and structure — do not skip this.
2. Ask the user for the topic and any key points they want covered. If they provide a slug or title, derive the filename from it.

## File creation

- Write the file to `posts/<slug>.md` where `<slug>` is kebab-case and descriptive (e.g. `scaling-backend-node-express.md`).
- If the user specifies a filename, use it.

## Frontmatter (required, exact format)

```yaml
---
title: "Quoted Title Here"
date: "YYYY-MM-DD"
excerpt: "One-sentence summary of the post."
tags: ["Tag1", "Tag2", "Tag3"]
img: "/images/blog/<descriptive-kebab-case>.png"
readingTime: "N min read"
---
```

Rules for frontmatter fields:

- `title` — always quoted. Short but descriptive.
- `date` — ISO date string, quoted.
- `excerpt` — one sentence, quoted. Covers the "what and why" of the post.
- `tags` — array of 3–6 quoted strings. Title Case. Pick from existing tags when possible: `["AI", "Backend", "Blockchain", "Cardano", "Hyperledger Fabric", "Python", "Go", "TypeScript", "Node.js", "NestJS", "Leadership", "Academic", "DevOps", "Automation"]`. Add new tags only when the topic demands it.
- `img` — path starting with `/images/blog/`. Use `.png` or `.jpeg` extension. This is a placeholder; the image does not need to exist yet.
- `readingTime` — format is `"N min read"`. Estimate from word count: ~250 words/min. Posts range 2–6 min.

## Content structure

Follow this section order. Every section uses `##` headings.

1. `## Introduction` — always present. 2–4 paragraphs. Hook the reader, state the problem or context, and preview what the post covers.
2. Hero image — placed immediately after (or within) the introduction:
   ```
   ![Descriptive alt text](/images/blog/<filename>.png)
   ```
3. Body sections — 2–5 `##`-level sections with descriptive titles. Use `###` sub-sections for detailed breakdowns.
4. Technical posts: include at least one **mermaid diagram** or **code block** (see formats below).
5. `## Conclusion` — always present. 1–2 paragraphs wrapping up and looking forward.

## Mermaid diagrams

Use proper fenced code blocks:

    ```mermaid
    graph TD
        A[Node A] --> B[Node B]
    ```

Do NOT use bare backtick blocks or non-standard wrapping.

## Code blocks

Fence with language identifier:

    ```python
    def example():
        pass
    ```

    ```typescript
    const example = () => {};
    ```

## Writing style

- First person ("I built", "we implemented").
- Professional but accessible — mix technical depth with narrative.
- Bold (`**text**`) for key terms and emphasis on first use.
- Link to real people/tools when referenced (supervisors get `[Name](URL)` format if a URL is known; otherwise just the name with titles).
- Avoid generic filler paragraphs. Every sentence should convey information.
- Post length: aim for the range of existing posts (roughly 500–1500 words, 2–6 min read).

## Image references

All blog images follow this pattern:

```
![Alt text describing the image](/images/blog/<descriptive-name>.png)
```

For photo carousels (see `blockchain-night-login.md`), the format is:

    ```
    `carousel
    ![Alt 1](/images/blog/img1.jpeg)
    <!-- slide -->
    ![Alt 2](/images/blog/img2.jpeg)
    <!-- slide -->
    ![Alt 3](/images/blog/img3.jpeg)
    `
    ```

Only use the carousel format if the user explicitly asks for multiple images.

## After writing

1. Verify the frontmatter parses correctly (no unquoted colons in values, proper YAML).
2. Remind the user that the `img` image is a placeholder and needs to be added to `public/images/blog/`.
3. The post will be available immediately at `/blog/<slug>` when the dev server is running (no restart needed — the Express API reads from `posts/` at request time).
