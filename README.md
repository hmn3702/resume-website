# Nghia Ha — Personal Resume Website

**Live:** [resume-website-six-mu.vercel.app](https://resume-website-six-mu.vercel.app)

A full-stack resume and portfolio site for a Brisbane-based Data Analyst, built with Next.js 14, Supabase and Tailwind CSS. All content is edited through a built-in admin CMS, so updating the resume never requires a code change or a redeploy.

## Tech Stack

- **Framework:** Next.js 14 (App Router, TypeScript)
- **Database, Auth & Storage:** Supabase (Postgres with Row Level Security)
- **Email:** Resend (contact-form notifications)
- **Styling:** Tailwind CSS + Framer Motion, Apple-inspired design system ([DESIGN.md](DESIGN.md))
- **Hosting:** Vercel

## Features

**Public site**
- Six pages: Home, About, Experience, Education, Projects, Contact
- Download CV button, served from Supabase Storage
- Contact form with server-side validation, a spam honeypot and an instant email alert
- Light/dark theme, animations that respect `prefers-reduced-motion`, loading skeletons
- SEO: per-page metadata, generated Open Graph image and favicon, sitemap, robots.txt
- Security headers: CSP, HSTS, X-Frame-Options, Referrer-Policy, Permissions-Policy

**Admin CMS (`/admin`)**
- Manage profile (avatar, CV PDF, bio, links), experience, education, skills, certifications and projects
- Feature or hide projects without deleting them
- Contact inbox with read/unread state, reply-by-email and delete
- Password reset by email; optional "Stay signed in"

## How it works

- **Fast, resilient pages (ISR).** Public pages are pre-rendered and cached for up to one hour. Every successful save in the admin calls `POST /api/revalidate`, which refreshes the cache immediately. Supabase queries throw on error, so if the database is unreachable the last good page keeps being served instead of an empty one.
- **Contact flow.** The form posts to `POST /api/contact`, which validates the input, stores it in `contact_messages` and emails the site owner through Resend. The email's `reply_to` is the sender, so replying from your mail app answers them directly. A failed email never loses the message, because it is already saved.
- **Security model.** The anon key is public by design; access is enforced by Row Level Security:

  | Who | Can do |
  |---|---|
  | Anyone (anon key) | Read published content and public files; send a contact message |
  | Admin accounts only | Create, update and delete content and files; read hidden projects and contact messages |

  No `service_role` key is used anywhere in the app.

## Getting Started

### 1. Clone and install

```bash
git clone https://github.com/hmn3702/resume-website.git
cd resume-website
npm install
```

### 2. Set up Supabase

1. Create a Supabase project.
2. **Create the admin user(s)** in **Authentication → Users → Add user**. The SQL below looks these accounts up, so create them first.
3. In **SQL Editor**, run the files in `supabase/` **in order**:

   | File | Purpose |
   |---|---|
   | `01_create_tables.sql` | Tables: profile, experience, education, skills, certifications, projects |
   | `02_rls.sql` | Enables RLS and public read access |
   | `03_seed.sql` | Optional sample content |
   | `04_admin_rls.sql` | Write access for the primary admin (**edit `admin_email` first**) |
   | `05_add_admin.sql` | Full access for a second admin account (edit the email) |
   | `06_project_visibility.sql` | `hidden` flag on projects; only admins see hidden ones |
   | `07_contact_messages.sql` | Contact inbox table; anon can insert only, admins read/update/delete |
   | `08_storage_admin_only.sql` | Storage policies for the `resume-assets` bucket (create the bucket first, step 4) |

   Admin emails are hard-coded in `04`–`08` and in `lib/admin.ts`. If you change them, change them everywhere.
4. **Storage:** create a **public** bucket named `resume-assets`, then run `08_storage_admin_only.sql`. Avatars, project images and CVs are stored there in `avatars/`, `projects/` and `cv/`.
5. **Authentication → Sign In / Providers:** turn **off** "Allow new users to sign up". Admin accounts are created manually.
6. **Authentication → URL Configuration:**
   - **Site URL:** your production URL, e.g. `https://yourname.vercel.app`
   - **Redirect URLs:** `https://yourname.vercel.app/auth/reset-password` and `http://localhost:3000/auth/reset-password`

   If the production URL is missing here, password-reset emails fall back to the Site URL and land on the wrong page.

### 3. Set environment variables

Copy `.env.example` to `.env.local` and fill in the values:

```bash
cp .env.example .env.local
```

| Variable | Where to find it | Secret? |
|---|---|---|
| `NEXT_PUBLIC_SUPABASE_URL` | Supabase → Settings → API | No (public) |
| `NEXT_PUBLIC_SUPABASE_ANON_KEY` | Supabase → Settings → API | No (public; protected by RLS) |
| `NEXT_PUBLIC_SITE_URL` | Your production URL, no trailing slash | No |
| `RESEND_API_KEY` | Resend → API Keys | **Yes**, never prefix with `NEXT_PUBLIC_` |
| `CONTACT_NOTIFY_EMAIL` | Inbox that receives contact alerts | No |
| `CONTACT_FROM_EMAIL` | Optional sender, defaults to `onboarding@resend.dev` | No |

Without a verified domain in Resend, alerts can only be sent to the email address you signed up to Resend with.

### 4. Run locally

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000). The admin panel is at [/admin/login](http://localhost:3000/admin/login).

## Deployment (Vercel)

1. Import the GitHub repo in [Vercel](https://vercel.com).
2. Add every variable from the table above in **Settings → Environment Variables** (Production). Mark `RESEND_API_KEY` as sensitive.
3. Deploy. `NEXT_PUBLIC_*` values are baked in at build time, so **redeploy after changing them**.
4. Supabase must be reachable during the build, because public pages are pre-rendered.

After the first deploy, paste the site URL into [LinkedIn Post Inspector](https://www.linkedin.com/post-inspector/) to check the share preview.

## Tests

```bash
# Component tests (Node's built-in test runner, no extra dependencies)
npm test

# Supabase connection check (reads .env.local)
node supabase/test_connection.mjs
```

`supabase/tests/project_visibility.sql` verifies the hidden-project RLS policies. It runs inside a transaction in the SQL Editor and rolls back.

## Project Structure

```
app/
  page.tsx                 # Home
  about/ experience/ education/ projects/ contact/
  admin/                   # CMS panel (auth-protected by middleware.ts)
    messages/              # Contact inbox
  api/
    contact/route.ts       # Validate, store, email via Resend
    revalidate/route.ts    # Admin-only cache refresh after saves
  auth/reset-password/     # Password reset landing page
  opengraph-image.tsx      # Generated share image
  icon.tsx apple-icon.tsx  # Generated favicons
components/                # UI components per section (+ admin/)
lib/
  supabase*.ts             # Supabase clients (cached public, browser, server, middleware)
  admin.ts                 # Admin email allow-list
  revalidate-site.ts       # Client helper for /api/revalidate
supabase/                  # SQL migrations 01–08 and tests
types/database.ts          # Database types
tests/                     # Node test runner tests
```
