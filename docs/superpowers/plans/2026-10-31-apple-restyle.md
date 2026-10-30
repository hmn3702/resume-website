# Apple restyle implementation plan

**Goal:** Apply the approved `docs/apple-design-plan.md` across the public portfolio.

**Architecture:** Reuse existing React components, Tailwind utilities, and shared CSS. Change presentation only; retain all routes, data fetching, form submission, authentication, and content.

**Tech stack:** Next.js 14, React 18, Tailwind 3, Framer Motion.

## Constraints

No new dependencies. White/parchment/charcoal surfaces, Action Blue #0066cc and dark-surface link blue #2997ff. System fonts, 17px body, 600 headings, pill actions, 18px cards, no decorative gradients or UI shadows. Preserve both themes, reduced motion, focus indicators, and 44px action targets.

## Tasks

- [x] Shared foundation: update `tailwind.config.ts`, `app/globals.css`, and `app/layout.tsx`. Replace the webfont with the system stack; define neutral and action palettes, shared button styles, card geometry, and responsive typography. Keep legacy admin color utilities compatible.
- [x] Public shell and homepage: update `components/layout/Navbar.tsx`, `Footer.tsx`, `components/ui/ThemeToggle.tsx`, `app/page.tsx`, and `components/home/*.tsx`. Remove scroll-shadow state and ornamental backgrounds; use compact black navigation, quiet footer, flat alternating sections, and pill CTAs. Preserve the mobile menu, theme toggle, profile/CV links, and conditional content.
- [x] Other public views: update `app/{about,experience,education,projects,contact}/page.tsx`, corresponding public components, and public skeletons. Replace decorative colors and gradients with neutral surfaces and blue actions; retain form errors and validation. Match loading typography to real page typography.
- [x] Verify: run `npm.cmd run lint`, `npx.cmd tsc --noEmit`, and `npm.cmd run build`. Inspect mobile/desktop, both themes, public routes, mobile navigation, form validation, keyboard focus, and overflow in the browser where available. Do not submit contact messages or mutate database content.

This is a reversible visual change; use existing static checks and browser inspection rather than adding tests that mirror CSS declarations. Keep changes uncommitted for review.

## Verification results

- Production build passed, including TypeScript and lint checks. Existing hook/image warnings remain; the initial build also reported the existing Supabase Edge Runtime warning.
- All six public routes rendered successfully in the browser. Checked 1440px desktop layout and 375px home, about, and contact views; no horizontal overflow in those checks.
- Checked light and dark themes, 44px primary actions, mobile navigation and automatic menu closure on route changes, required form fields and labels, and visible keyboard focus. No contact message was submitted.
- Reduced-motion reload initially exposed an initial transform hydration mismatch. Replaced slide/scale entrances with fades and verified reload/navigation without console errors.
- Database-backed sections returned empty data locally. Populated grids, live images/CV, message delivery, and authenticated admin workflows were not verified.
- No dependencies added; changes remain uncommitted.
