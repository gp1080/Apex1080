-- Run this in Supabase → SQL Editor

create table if not exists waitlist_submissions (
  id uuid default gen_random_uuid() primary key,
  email text not null,
  created_at timestamptz default now()
);

create unique index if not exists waitlist_submissions_email_idx
  on waitlist_submissions (lower(email));

create table if not exists contact_submissions (
  id uuid default gen_random_uuid() primary key,
  name text not null,
  email text not null,
  subject text,
  message text not null,
  created_at timestamptz default now()
);

alter table waitlist_submissions enable row level security;
alter table contact_submissions enable row level security;

drop policy if exists "Public insert waitlist" on waitlist_submissions;
create policy "Public insert waitlist"
  on waitlist_submissions for insert to anon
  with check (true);

drop policy if exists "Public insert contact" on contact_submissions;
create policy "Public insert contact"
  on contact_submissions for insert to anon
  with check (true);

drop policy if exists "Admin read waitlist" on waitlist_submissions;
create policy "Admin read waitlist"
  on waitlist_submissions for select to authenticated
  using (true);

drop policy if exists "Admin read contact" on contact_submissions;
create policy "Admin read contact"
  on contact_submissions for select to authenticated
  using (true);
