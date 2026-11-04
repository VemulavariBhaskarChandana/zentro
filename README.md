# ZENTRO

ZENTRO is a Next.js App Router student project discovery and mentoring platform.
Supabase Auth provides email/password accounts, email verification, password
recovery, and cookie-backed server sessions.

## Local setup

1. Install dependencies with `npm install`.
2. Set these values in `.env.local`:
   - `NEXT_PUBLIC_SUPABASE_URL`: project URL.
   - `NEXT_PUBLIC_SUPABASE_ANON_KEY`: Supabase anon/public key. This key is
     intended for browser use; database access is still governed by RLS.
   - `SUPABASE_SERVICE_ROLE_KEY`: service role key, server-only. Never add a
     `NEXT_PUBLIC_` prefix or expose this value in client code.
3. Run the migrations in order in the Supabase SQL Editor:
   - `database/migrations/202611020001_create_students.sql`
   - `database/migrations/202611030001_create_project_catalog.sql`
   - `database/migrations/202611040001_migrate_students_to_supabase_auth.sql`
   - `database/migrations/202611050001_expand_student_catalog.sql`
   - `database/migrations/202611060001_project_specific_explanations.sql`
4. Configure Supabase Auth:
   - Under **Authentication → URL Configuration**, set the Site URL to
     `http://localhost:3000` and add `http://localhost:3000/auth/callback` to
     the allowed redirect URLs.
   - Under **Authentication → Providers**, enable email/password and email
     confirmation. Configure the confirmation email template to send users
     back to the redirect URL supplied by the app. Supabase’s default email
     sender has strict development limits; configure custom SMTP for reliable
     delivery.
5. Run `npm run dev`.

The app uses Supabase SSR cookies and validates sessions with `auth.getUser()`.
Proxy refreshes sessions and redirects signed-out requests; protected pages and
server actions independently verify the user. Sign-up confirmation links use
`/auth/callback`; password reset links return to `/reset-password`.

## Student data and catalog

The first migration creates the student profile table. The catalog migration creates categories, projects, demo bookings, RLS
restrictions, and editorial seed data. The latest migration fills the catalog
to ten projects per category and extends demo requests with contact details;
existing request records are retained. The auth migration adds nullable
`user_id` UUID references to
Supabase Auth users and indexes them; it keeps legacy Clerk ID columns and rows
intact, but does not guess which Supabase account owns an old Clerk profile.
Students with legacy records should complete onboarding again under Supabase
Auth to create a correctly linked profile.

Catalog, profile, and guidance-request database operations run through server-only
code with the service role. Browser auth uses only the anon/public key. Row
level security remains enabled, with no direct client policies for these
private tables. Category counts and project listings come from Supabase;
guidance requests are stored as `requested`, not presented as confirmed
appointments.
The latest project-detail migration replaces repeated placeholder explanations
with project-specific problem statements and clearer project workflows.
