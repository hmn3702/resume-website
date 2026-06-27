# Nghia Ha — Personal Resume Website

A full-stack personal resume and portfolio website built with Next.js 14, Supabase, and Tailwind CSS. All content is managed through a built-in admin CMS — no code changes needed to update resume data.

## Tech Stack

- **Framework:** Next.js 14 (App Router, SSR)
- **Database & Auth:** Supabase (Postgres + Auth + Storage)
- **Styling:** Tailwind CSS + Framer Motion
- **Language:** TypeScript
- **Deployment:** Vercel

## Features

- Six public pages: Home, About, Experience, Education, Projects, Contact
- Admin CMS panel at `/admin` — manage all resume content without touching code
- Dark mode with system preference detection
- Animated transitions respecting `prefers-reduced-motion`
- Loading skeletons for all data-fetching routes
- Full SEO: per-page metadata, Open Graph image, sitemap, robots.txt
- Security headers: CSP, HSTS, X-Frame-Options, Referrer-Policy, Permissions-Policy
- Custom 404 and error boundary pages

## Getting Started

### 1. Clone and install

```bash
git clone https://github.com/hmn3702/resume-website.git
cd resume-website
npm install
```

### 2. Set up environment variables

Copy `.env.example` to `.env.local` and fill in your values:

```bash
cp .env.example .env.local
```

Required variables:

| Variable | Where to find it |
|---|---|
| `NEXT_PUBLIC_SUPABASE_URL` | Supabase dashboard → Settings → API |
| `NEXT_PUBLIC_SUPABASE_ANON_KEY` | Supabase dashboard → Settings → API |
| `NEXT_PUBLIC_SITE_URL` | Your production URL (e.g. `https://yourname.vercel.app`) |

### 3. Run the dev server

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000).

## Admin Panel

Navigate to `/admin/login` and sign in with your Supabase Auth credentials. The admin panel lets you manage:

- **Profile** — name, title, bio, avatar, social links
- **Experience** — work history with dates, location, bullet points
- **Education** — degrees and professional certifications
- **Skills** — categorised skill list with proficiency levels
- **Projects** — portfolio projects with images, tags, featured flag

## Deployment

### Vercel (recommended)

1. Push to GitHub and import the repo in [Vercel](https://vercel.com)
2. Add environment variables in Vercel dashboard → Settings → Environment Variables:
   - `NEXT_PUBLIC_SUPABASE_URL`
   - `NEXT_PUBLIC_SUPABASE_ANON_KEY`
   - `NEXT_PUBLIC_SITE_URL` (set to your actual Vercel URL)
3. Deploy — Vercel handles everything else

## Project Structure

```
app/
  page.tsx          # Home
  about/            # About & skills
  experience/       # Work history
  education/        # Degrees & certifications
  projects/         # Portfolio
  contact/          # Contact form
  admin/            # CMS panel (auth-protected)
components/         # UI components per section
lib/                # Supabase clients (browser, server, middleware)
types/              # TypeScript database types
```
