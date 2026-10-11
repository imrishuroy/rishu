# Architecture

This document covers how the portfolio site is structured, the decisions behind those choices, and how to deploy it.

---

## Rendering strategy

The site uses Next.js 15 App Router. Every page is statically generated at build time (SSG) with no server-side data fetching at runtime.

- The home page (`/`) is a static page. All section data is hardcoded in the component files.
- The blog listing (`/blogs`) is static. It reads all MDX files at build time via `lib/posts.ts`.
- Individual blog posts (`/blogs/[slug]`) use `generateStaticParams` to pre-render every post at build time. There is no fallback route, so only posts that exist at build time will be accessible.
- The contact page (`/contact`) is a static server component.

This means the full site deploys as a set of HTML files with no runtime server needed, which is why it works on Vercel's free Hobby plan.

---

## Data flow for blog posts

```
content/blogs/*.mdx
        |
        | (Node fs.readdirSync at build time)
        v
lib/posts.ts  getAllPosts()
        |
        | returns PostMeta[]
        v
app/blogs/page.tsx          --> renders PostCard list
components/sections/BlogPreview.tsx --> renders latest 3 PostCards

lib/posts.ts  getPostBySlug(slug)
        |
        | returns Post (PostMeta + content string)
        v
app/blogs/[slug]/page.tsx   --> renders PostHeader + MdxContent
```

`PostMeta` holds the frontmatter fields (title, date, tags, summary, readTime, draft).
`Post` adds the raw MDX content string.

Both functions run on the server only. The MDX string is passed to `MdxContent` which compiles it in the browser using `next-mdx-remote`.

---

## Component categories

### Layout components

`Navbar` and `Footer` are in `components/layout/`. They wrap every page because they are imported in `app/layout.tsx`.

`Navbar` is a client component (`'use client'`) because it manages mobile open/close state with `useState`. Everything else in the layout is a server component.

### Section components

Components in `components/sections/` are the five blocks on the home page. They are all server components except `EmailCopyButton`, which is a client component because it uses the Clipboard API.

Each section has its own `id` matching a nav link href:
- `#hero` - Hero
- `#experience` - Experience
- `#skills` - Skills
- `#projects` - Projects
- Blog links to the `/blogs` route, not an anchor

### Blog components

`PostCard` is used in two places: `BlogPreview` (home page) and `app/blogs/page.tsx` (listing). It is a server component.

`PostHeader` is the top of an individual post page: title, tags, date, read time.

`MdxContent` takes a compiled MDX source and renders it. It applies the `.mdx-content` CSS class for prose styling.

### UI primitives

`Button`, `Card`, and `Badge` are in `components/ui/`. They are generic and not portfolio-specific.

`Button` is a polymorphic component. It renders as `<a>` when given an `href` prop and as `<button>` when not. The TypeScript types use a discriminated union to enforce this:

```ts
type AnchorProps = BaseProps & React.AnchorHTMLAttributes<HTMLAnchorElement> & { href: string }
type ActionProps = BaseProps & React.ButtonHTMLAttributes<HTMLButtonElement> & { href?: never }
type ButtonProps = AnchorProps | ActionProps
```

---

## Styling

All styles use Tailwind CSS utility classes. There are no CSS modules (except the unused `page.module.css` from the Next.js scaffold, which can be deleted).

Custom design tokens are all in `tailwind.config.ts`. Component files use only those token names, not raw hex values.

Global styles in `app/globals.css` cover:
- Tailwind base, components, and utilities directives
- `.cyan-glow`, `.pulse-dot`, `.hairline-border`, `.code-editor` utility classes
- `.mdx-content` prose styles for blog post typography, code blocks, blockquotes, and tables

The font stack loads two Google Fonts:
- `Inter` for body text (variable, subsets: latin)
- `JetBrains Mono` for monospace (weights 400, 500, 600)

Material Symbols Outlined icons are loaded from the Google CDN via a `<link>` tag in the root layout. They are used as text content in `<span>` elements: `<span className="material-symbols-outlined">home</span>`.

Social icons (GitHub, LinkedIn, LeetCode) are inline SVG paths in the Navbar and Projects components. They avoid a CDN dependency and match the design size exactly.

---

## Accessibility

- The site uses semantic HTML: `<header>`, `<main>`, `<footer>`, `<nav>`, `<section>`, `<article>` where appropriate.
- Heading hierarchy: one `<h1>` per page (hero headline), `<h2>` for section headings, `<h3>` for card headings within sections.
- The mobile hamburger button has `aria-label`, `aria-expanded`, and `aria-controls` attributes. The controlled `<nav id="mobile-nav">` is always in the DOM and hidden with a CSS `hidden` class when closed, so the `aria-controls` reference is always valid.
- SVG icons in nav links use `aria-hidden="true"`. The parent `<a>` has a `title` attribute for screen reader labeling.
- Color contrast meets WCAG AA for main text against the dark surface background.
- `scroll-smooth` is set on `<html>` for anchor link scrolling.

---

## SEO

`app/layout.tsx` exports a `metadata` object with the site title, description, keywords, and Open Graph fields.

Individual blog posts get their own metadata in `app/blogs/[slug]/page.tsx` via `generateMetadata`. This includes:
- Post title and summary
- `publishedTime` as an ISO date string (only set if the date parses cleanly)
- Post tags as OG tags

Each blog post also gets an auto-generated OG image via `app/blogs/[slug]/opengraph-image.tsx`.

---

## Testing

Tests use Vitest with jsdom and Testing Library.

```bash
npm test           # run once
npm run test:watch # watch mode
```

Test files:
- `lib/__tests__/posts.test.ts` - `getAllPosts` filtering, sorting, draft exclusion; `getPostBySlug` hit and miss
- `lib/__tests__/utils.test.ts` - `formatDate`, `cn`
- `components/layout/__tests__/Navbar.test.tsx` - renders nav links, mobile toggle
- `components/sections/__tests__/EmailCopyButton.test.tsx` - clipboard copy, confirmation state

Fixture MDX files for posts tests are in `lib/__tests__/__fixtures__/blogs/`.

---

## Deployment

### What you need

- GitHub account with the repo pushed
- Vercel account (free Hobby plan is enough)
- A domain name (optional but recommended)

### Steps

**1. Push to GitHub**

```bash
git init
git add .
git commit -m "Initial commit"
gh repo create rishu-portfolio --public --source=. --push
```

Or create the repo on GitHub manually and then:

```bash
git remote add origin https://github.com/imrishuroy/rishu-portfolio.git
git branch -M main
git push -u origin main
```

**2. Deploy to Vercel**

- Go to vercel.com/new
- Click "Import Git Repository"
- Select your GitHub repo
- Leave all settings as default (Vercel detects Next.js automatically)
- Click Deploy

The site builds and deploys in about 60 seconds. Vercel gives you a `.vercel.app` URL immediately.

**3. Add a custom domain**

In the Vercel dashboard:
- Open your project
- Go to Settings > Domains
- Enter your domain (example: `rishukumar.dev`)
- Vercel shows you DNS records to add

At your domain registrar:
- Add the CNAME or A records Vercel specifies
- DNS changes take up to 48 hours to propagate but usually resolve within 15 minutes

**4. Subsequent deploys**

Every push to the `main` branch triggers a new Vercel deploy automatically. No manual steps needed after the first setup.

### Resume PDF

The file `public/resume.pdf` is served at `/resume.pdf`. Update it by replacing the file and pushing to GitHub. Vercel redeploys automatically.

### Environment variables

This project has no environment variables. All data is static and embedded in the code.

---

## Known warnings at build time

These are non-blocking and do not affect the build output:

1. **Turbopack workspace root warning** - Next.js found two `package-lock.json` files in the parent directory. This is harmless as long as you run commands from inside `rishu-portfolio/`.

2. **Tailwind glob pattern warning** - The pattern `./content/**/*.{mdx}` in `tailwind.config.ts` uses brace syntax that Tailwind warns about. Change it to `./content/**/*.mdx` to silence it (the `{mdx}` pattern still works, it just generates a warning).

3. **postcss.config.js module type warning** - Node warns that `postcss.config.js` has no `type` field but uses ES module syntax. Adding `"type": "module"` to `package.json` silences this.

4. **metadataBase not set** - Vercel's OG image resolution works correctly in production without setting `metadataBase`. In local builds the warning shows `http://localhost:3000` as the base which is correct for local preview.

---

## Folder move checklist

If you move the project to a different location on disk:

1. `cd` into the new location
2. Run `npm install` again (or just verify `node_modules/` exists)
3. Run `npm run build` to confirm the build still passes
4. If using VS Code, reopen the folder so the TypeScript server picks up the new path
5. If the git repo was initialized, check `git remote -v` to confirm the remote URL is still correct
6. Update any absolute paths in editor config or shell aliases that pointed to the old location
