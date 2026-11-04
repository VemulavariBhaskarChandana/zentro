create table if not exists public.students (
  id uuid primary key default gen_random_uuid(),
  clerk_user_id text not null unique,
  full_name text not null check (char_length(btrim(full_name)) between 2 and 120),
  college_name text not null check (char_length(btrim(college_name)) between 2 and 180),
  qualification text not null check (
    qualification in ('BCA', 'BSc', 'B.Tech', 'BE', 'MCA', 'MSc', 'Other')
  ),
  department text not null check (char_length(btrim(department)) between 2 and 120),
  current_year text not null check (char_length(btrim(current_year)) between 1 and 60),
  project_type text not null check (
    project_type in ('Basic Project', 'Mini Project', 'Major Project', 'Not Sure Yet')
  ),
  technical_level text not null check (
    technical_level in ('Complete Beginner', 'Basic Knowledge', 'Intermediate', 'Advanced')
  ),
  interests text[] not null check (cardinality(interests) between 1 and 10),
  has_project_idea boolean not null,
  project_goal text not null check (
    project_goal in (
      'College submission',
      'Learning new skills',
      'Resume building',
      'Real-world problem solving'
    )
  ),
  additional_requirements text not null default ''
    check (char_length(additional_requirements) <= 2000),
  onboarding_completed boolean not null default false,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create or replace function public.set_students_updated_at()
returns trigger
language plpgsql
as $$
begin
  new.updated_at = now();
  return new;
end;
$$;

drop trigger if exists students_set_updated_at on public.students;
create trigger students_set_updated_at
before update on public.students
for each row execute function public.set_students_updated_at();

alter table public.students enable row level security;
revoke all on public.students from anon, authenticated;
grant all on public.students to service_role;
