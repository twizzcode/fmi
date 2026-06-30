<!-- BEGIN:nextjs-agent-rules -->
# This is NOT the Next.js you know

This version has breaking changes — APIs, conventions, and file structure may all differ from your training data. Read the relevant guide in `node_modules/next/dist/docs/` before writing any code. Heed deprecation notices.
<!-- END:nextjs-agent-rules -->

# Development Commands

- `npm run dev` - Start dev server (default: http://lvh.me:3000)
- `npm run build` - Build for production
- `npm run lint` - Run ESLint (MUST run after code changes)
- `npm run db:generate` - Generate Drizzle migrations from schema changes
- `npm run db:push` - Push schema changes to database (requires DATABASE_URL)

**After schema changes**: run `npm run db:generate` then `npm run db:push` in that order.

# Architecture

## Multi-tenant subdomain setup

- **Main app**: `lvh.me:3000` (public site, auth)
- **Admin panel**: `admin.lvh.me:3000` (admin/developer only)
- Uses `proxy.ts` exports (`proxy` function and `config` matcher) for middleware behavior
- Cross-subdomain auth via `better-auth` with shared cookie domain (`lvh.me`)

## Route groups

- `app/(public)/` - Public pages (berita, galeri, struktur, etc.)
- `app/(admin)/admin-space/` - Admin panel pages (served at `admin.lvh.me`)
- `app/(auth)/` - Auth pages (login, register)
- `app/api/auth/` - better-auth API routes
- `app/api/admin/` - Admin API routes

Admin layout checks session and role, redirects unauthorized users to main app.

## Tech stack

- **Next.js 16.2.9** (App Router, React 19, RSC)
- **Database**: PostgreSQL via Drizzle ORM (`lib/db/schema.ts` - 284 lines, 10+ tables)
- **Auth**: better-auth with Drizzle adapter, email/password + Google OAuth
- **Storage**: Supabase Storage (`lib/supabase/`)
- **UI**: shadcn/ui (radix-nova style), Tailwind CSS 4, Framer Motion, Lexical editor
- **Path alias**: `@/*` maps to project root

## Database

- Schema: `lib/db/schema.ts`
- Config: `drizzle.config.ts` (requires `DATABASE_URL`)
- Migrations: `drizzle/` directory
- Generate migrations after schema changes: `npm run db:generate`
- Push to DB: `npm run db:push`

## Environment

Required vars (see `.env.example`):
- `DATABASE_URL` - Postgres connection
- `BETTER_AUTH_SECRET` - Auth secret
- `BETTER_AUTH_URL` - Auth base URL (default: http://lvh.me:3000)
- `NEXT_PUBLIC_APP_URL` / `NEXT_PUBLIC_ADMIN_URL` - App URLs
- `AUTH_COOKIE_DOMAIN` - Cookie domain (default: lvh.me)
- `NEXT_PUBLIC_SUPABASE_URL` / keys - Supabase config
- Optional: `GOOGLE_CLIENT_ID` / `GOOGLE_CLIENT_SECRET` for OAuth

## Key files

- `lib/app-config.ts` - URL/origin/host helpers, admin access check
- `lib/auth.ts` - better-auth config with role-based access
- `lib/db/schema.ts` - Full database schema
- `proxy.ts` - Middleware-like behavior for admin subdomain routing
- `components.json` - shadcn config with multiple registries

## Conventions

- Uses shadcn components from `@/components/ui`
- Icons: `lucide-react`, `@hugeicons/react`, `@tabler/icons-react`
- No TypeScript comments unless requested
- Match existing code style (check imports/patterns before writing)
