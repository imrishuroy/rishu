# Rishu Kumar - Portfolio Website

Personal portfolio website for Rishu Kumar, Backend Software Engineer. Built with Next.js 15, Tailwind CSS, and MDX. Covers work experience, skills, projects, and a technical blog.

Live at: [rishukumar.dev](https://rishukumar.dev) (after deployment)

---

## Tech Stack

| Layer | Technology |
|---|---|
| Framework | Next.js 15 (App Router) |
| Language | TypeScript |
| Styling | Tailwind CSS v3 with custom design tokens |
| Blog content | MDX via next-mdx-remote |
| Syntax highlighting | rehype-pretty-code + Shiki |
| Fonts | Inter (body), JetBrains Mono (code) via Google Fonts |
| Icons | Material Symbols Outlined (Google CDN) + inline SVGs |
| Testing | Vitest + Testing Library |
| Deployment | Vercel (Hobby plan) |

---

## Project Structure

```
rishu-portfolio/
├── app/                        # Next.js App Router pages
│   ├── layout.tsx              # Root layout: fonts, Navbar, Footer, metadata
│   ├── page.tsx                # Home page: Hero + Experience + Skills + Projects + BlogPreview
│   ├── globals.css             # Global CSS: Tailwind base + MDX prose styles + utility classes
│   ├── not-found.tsx           # Custom 404 page
│   ├── blogs/
│   │   ├── page.tsx            # Blog listing page: all published posts
│   │   └── [slug]/
│   │       ├── page.tsx        # Individual blog post page with OG metadata
│   │       └── opengraph-image.tsx  # Auto-generated OG image per post
│   └── contact/
│       └── page.tsx            # Contact page: email, GitHub, LinkedIn, LeetCode
│
├── components/
│   ├── layout/
│   │   ├── Navbar.tsx          # Sticky top nav: brand, desktop links, social icons, mobile drawer
│   │   └── Footer.tsx          # Minimal footer: copyright only
│   ├── sections/               # Home page sections (used in app/page.tsx)
│   │   ├── Hero.tsx            # Name, headline, sub-text, CTA buttons, status badge
│   │   ├── Experience.tsx      # Work history cards: Maersk + Green Apex
│   │   ├── Skills.tsx          # Four skill group cards: Languages, Backend, Cloud, Data
│   │   ├── Projects.tsx        # AlgoPatterns project: architecture diagram + feature cards
│   │   ├── BlogPreview.tsx     # Latest 3 blog posts shown on home page
│   │   └── EmailCopyButton.tsx # Button that copies email to clipboard
│   ├── blog/
│   │   ├── PostCard.tsx        # Blog post card used in listing and preview
│   │   ├── PostHeader.tsx      # Title, tags, date, read time shown at top of a post
│   │   └── MdxContent.tsx      # Renders MDX with rehype-pretty-code and rehype-slug
│   └── ui/
│       ├── Button.tsx          # Polymorphic button/anchor component
│       ├── Card.tsx            # Generic surface card wrapper
│       └── Badge.tsx           # Small label chip
│
├── content/
│   └── blogs/                  # MDX blog posts (one file per post)
│       ├── go-gc-at-100k-rps.mdx
│       ├── kafka-idempotent-events.mdx
│       └── otel-sdk-go.mdx
│
├── lib/
│   ├── posts.ts                # Reads and parses MDX frontmatter, exports PostMeta and Post types
│   ├── utils.ts                # cn() helper for class merging, formatDate() for display
│   ├── shiki-theme.ts          # Custom Shiki syntax highlight theme
│   └── __tests__/              # Unit tests for posts.ts and utils.ts
│
├── public/
│   └── resume.pdf              # Resume PDF served at /resume.pdf
│
├── tailwind.config.ts          # Design tokens: colors, typography scale, spacing
├── tsconfig.json               # TypeScript config with @/ path alias
├── vitest.config.ts            # Vitest test runner config
├── eslint.config.mjs           # ESLint config (Next.js rules)
└── docs/                       # Project documentation
    └── architecture.md         # Detailed architecture and design decisions
```

---

## Running Locally

```bash
# Install dependencies
npm install

# Start dev server with Turbopack
npm run dev
```

Open [http://localhost:3000](http://localhost:3000).

```bash
# Type check + lint
npm run lint

# Run tests
npm test

# Production build (checks types and static generation)
npm run build
```

---

## Design System

The site uses a custom dark theme called "Obsidian Cyan Engine". All colors are defined in `tailwind.config.ts` as custom tokens and follow the Material Design 3 naming pattern.

### Key colors

| Token | Value | Use |
|---|---|---|
| `background` / `surface` | `#10131a` | Page background |
| `primary` | `#5cd4ff` | Cyan accent, links, highlights |
| `primary-container` | `#00add8` | Button backgrounds, glows |
| `secondary` | `#adc6ff` | Blue accent for secondary emphasis |
| `tertiary` | `#4edea3` | Green accent for status, awards |
| `on-surface` | `#e1e2ec` | Main text |
| `on-surface-variant` | `#bcc8cf` | Muted text, descriptions |
| `outline-variant` | `#3d484e` | Borders, dividers |

### Typography scale

Custom font size tokens are in `tailwind.config.ts` under `fontSize`. Examples:

- `text-display` - 3.5rem, weight 800, for the hero headline
- `text-headline-xl` - 2.5rem, weight 700, for section headings (h2)
- `text-headline-md` - 1.5rem, weight 600, for card headings (h3)
- `text-body-lg` - 1.125rem, weight 400, for paragraph text
- `text-label-md` - 0.875rem, weight 600, for nav links and chips
- `text-label-sm` - 0.75rem, weight 600, for timestamps and small labels

### Custom utility classes (globals.css)

- `.cyan-glow` - subtle cyan box shadow used on primary buttons and the brand badge
- `.pulse-dot` - green glow for the animated ping status dot
- `.mdx-content` - prose styles applied to blog post content

---

## Blog System

Blog posts live in `content/blogs/` as MDX files.

### Frontmatter fields

```yaml
---
title: "Your Post Title"
date: "2026-01-15"        # ISO date string, YYYY-MM-DD
tags: ["Go", "Kafka"]     # Array of tag strings
summary: "One sentence description of the post."
readTime: 8               # Estimated read time in minutes (integer)
draft: false              # Set to true to hide from listing
---
```

All fields except `date` and `readTime` will render gracefully if missing. `date` and `readTime` are optional at runtime but should always be set for proper display.

### How posts are loaded

`lib/posts.ts` reads all `.mdx` files from `content/blogs/` at build time using Node `fs`. Posts with `draft: true` are excluded. The rest are sorted by date descending.

The home page shows the 3 most recent posts via `BlogPreview`. The `/blogs` route shows all of them.

### Adding a new post

1. Create a new file in `content/blogs/your-slug.mdx`
2. Add the frontmatter fields above
3. Write the post body in MDX (markdown with optional JSX)
4. Run `npm run build` to verify it compiles

---

## Pages

### Home (`/`)

Composed of five section components rendered in order:

1. **Hero** - Name, role, CTA buttons (Resume, Projects, Email copy), animated status badge
2. **Experience** - Three job cards: Maersk ASE, Maersk Intern, Green Apex Mobile Engineer
3. **Skills** - Four skill group cards: Languages, Backend and Distributed, Cloud and DevOps, Data and Observability
4. **Projects** - AlgoPatterns project card with layered architecture diagram and feature grid
5. **BlogPreview** - Three most recent blog post cards

### Blog listing (`/blogs`)

Shows all published posts as PostCard components. Posts are sorted newest first.

### Blog post (`/blogs/[slug]`)

Statically generated at build time using `generateStaticParams`. Each post gets its own Open Graph metadata including `publishedTime` and tags.

### Contact (`/contact`)

Shows email (with copy button), GitHub, LinkedIn, and LeetCode links as cards.

### 404 (`/not-found.tsx`)

Custom not-found page with a link back to home.

---

## Key Components

### Navbar

Sticky header with:
- Brand badge "RK" + name linking to hero
- Desktop navigation links (Home, Experience, Skills, Projects, Blog)
- Social icon links: GitHub, LinkedIn, LeetCode, Email
- "Download Resume" CTA button
- Mobile hamburger menu with accessible aria attributes

The mobile nav is always present in the DOM (for `aria-controls` to reference) and toggled with a `hidden` class.

### Button (polymorphic)

`components/ui/Button.tsx` renders an `<a>` tag when `href` is passed, or a `<button>` when not. Uses TypeScript discriminated union types to enforce correct prop combinations.

### EmailCopyButton

Client component that copies `rishukumar.prince@gmail.com` to the clipboard when clicked. Shows a brief "Copied!" confirmation.

### MdxContent

Renders MDX source using `next-mdx-remote` with two rehype plugins:
- `rehype-pretty-code` for syntax-highlighted code blocks using Shiki
- `rehype-slug` for auto-generated heading anchor IDs

---

## Deployment

The site deploys to Vercel. See `docs/architecture.md` for full deployment steps.

Quick steps:
1. Push code to a GitHub repository
2. Import the repo in Vercel (vercel.com/new)
3. Vercel auto-detects Next.js, no config needed
4. Add a custom domain in Vercel dashboard project settings
5. Update nameservers or add CNAME at your domain registrar

Resume PDF must be placed at `public/resume.pdf` before building. It is served at `/resume.pdf`.

---

## Testing

Tests use Vitest and Testing Library.

```bash
npm test           # Run all tests once
npm run test:watch # Watch mode
```

Test files live next to the code they test under `__tests__/` folders:
- `lib/__tests__/posts.test.ts` - tests for `getAllPosts` and `getPostBySlug`
- `lib/__tests__/utils.test.ts` - tests for `formatDate` and `cn`
- `components/layout/__tests__/Navbar.test.tsx` - Navbar render and interaction
- `components/sections/__tests__/EmailCopyButton.test.tsx` - clipboard copy behavior
