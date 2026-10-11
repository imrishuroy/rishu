# CLAUDE.md - Project Guide for Claude

This file gives Claude context about this project so it can make good decisions without asking basic questions each time.

## What this project is

Personal portfolio website for Rishu Kumar, Backend Software Engineer at Maersk. The site has a home page with five sections, a technical blog, a contact page, and a custom 404 page. It deploys to Vercel and is built with Next.js 15 App Router.

## Owner

- Name: Rishu Kumar
- Email: rishukumar.prince@gmail.com
- GitHub: https://github.com/imrishuroy
- LinkedIn: https://www.linkedin.com/in/imrishuroy/
- LeetCode: https://leetcode.com/imrishuroy
- Current role: Associate Software Engineer at Maersk, Bengaluru, India
- Primary language: Go (Golang)

## Tech stack

- Next.js 15 with App Router and TypeScript
- Tailwind CSS v3 with custom design tokens (no Tailwind v4 syntax)
- MDX via next-mdx-remote for blog posts
- Vitest + Testing Library for tests
- Vercel for deployment

## Commands

```bash
npm run dev        # Start dev server (Turbopack)
npm run build      # Production build with type check and static generation
npm run lint       # ESLint
npm test           # Run all tests
npm run test:watch # Vitest watch mode
```

## File layout

```
app/           Next.js pages
components/    React components
  layout/      Navbar, Footer
  sections/    Home page sections (Hero, Experience, Skills, Projects, BlogPreview, EmailCopyButton)
  blog/        Blog components (PostCard, PostHeader, MdxContent)
  ui/          Generic primitives (Button, Card, Badge)
content/blogs/ MDX blog posts
lib/           Utilities (posts.ts, utils.ts, shiki-theme.ts)
public/        Static files including resume.pdf
docs/          Project documentation
```

## Design system

The color scheme is a dark theme called "Obsidian Cyan Engine". All color tokens are in `tailwind.config.ts`.

Primary accent: cyan (`#5cd4ff`, token `primary`)
Secondary accent: blue (`#adc6ff`, token `secondary`)
Tertiary accent: green (`#4edea3`, token `tertiary`)
Surface: dark navy (`#10131a`, token `surface`)
Main text: `#e1e2ec` (`on-surface`)
Muted text: `#bcc8cf` (`on-surface-variant`)

Typography tokens (not standard Tailwind sizes):
- `text-display` - hero headline
- `text-headline-xl` - section h2 headings
- `text-headline-md` - card h3 headings
- `text-body-lg` - paragraph text
- `text-label-md` - nav links, chips
- `text-label-sm` - timestamps, meta

Custom utility classes in `globals.css`:
- `.cyan-glow` - cyan box shadow on buttons and the RK brand badge
- `.pulse-dot` - green glow for status dots
- `.mdx-content` - prose styles for blog post body

## Content conventions

- No em-dashes anywhere. Use a comma, period, or rephrase instead.
- Simple language. No marketing speak, no fake metrics.
- All content must match the actual resume. Do not invent numbers, percentages, or claims.
- Company name is "Maersk", not "A.P. Moller - Maersk".
- Job title is "Associate Software Engineer", not "ASE".

## Type safety rules

- `PostMeta.date` is typed as `string | undefined`. Always guard with `post.date ?` before using it.
- `PostMeta.readTime` is `number` but may be `0` when frontmatter is missing. Guard with `post.readTime > 0` before rendering.
- `new Date(someString).toISOString()` will throw a RangeError if the string is not a valid date format. Always check `!isNaN(d.getTime())` before calling `.toISOString()`.

## Blog posts

MDX files go in `content/blogs/`. Required frontmatter:

```yaml
---
title: "Post Title"
date: "2026-01-15"
tags: ["Go", "Kafka"]
summary: "One line description."
readTime: 8
draft: false
---
```

Use `draft: true` to hide a post from listing without deleting it.

## Accessibility rules

- The mobile nav `<nav id="mobile-nav">` must always be in the DOM so that `aria-controls="mobile-nav"` on the hamburger button has a valid target. Toggle visibility with a `hidden` CSS class, not conditional rendering.
- Section headings on the home page use `<h2>`. Card headings inside sections use `<h3>`. Do not use `<h2>` inside a section that already has an `<h2>`.
- Social icon links use `aria-hidden="true"` on the SVG and a `title` attribute on the `<a>` tag for screen reader labeling.

## Heading hierarchy

```
h1 - Hero section only (Rishu Kumar - Backend Software Engineer)
h2 - Section headings (Work Experience, Skills, Projects, Blog)
h3 - Card headings within sections (AlgoPatterns, company names, post titles)
```

## What not to change without asking

- The color tokens in `tailwind.config.ts` form the full design system. Do not swap to arbitrary hex values in components.
- The resume PDF at `public/resume.pdf` is the actual resume. Do not generate content that contradicts it.
- The `PostMeta` type in `lib/posts.ts`. Any change to its shape must be propagated to all callers (PostCard, PostHeader, generateMetadata).

## What not to add

- No fake metrics, performance numbers, uptime percentages, or throughput numbers unless they come directly from the resume.
- No decorative widgets that simulate a terminal, cluster status, or system health dashboard.
- No em-dashes.
- No comments that describe what code does (use clear naming instead). Comments are only for non-obvious WHY information.
