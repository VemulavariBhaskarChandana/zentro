alter table public.students
  add column if not exists user_id uuid references auth.users(id) on delete cascade;

alter table public.students
  alter column clerk_user_id drop not null;

create unique index if not exists students_user_id_unique_idx
  on public.students (user_id);

alter table public.demo_bookings
  add column if not exists user_id uuid references auth.users(id) on delete cascade;

alter table public.demo_bookings
  alter column clerk_user_id drop not null;

create index if not exists demo_bookings_user_created_idx
  on public.demo_bookings (user_id, created_at desc)
  where user_id is not null;
