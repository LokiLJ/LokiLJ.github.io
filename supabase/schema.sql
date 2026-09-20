-- Portfolio CMS schema for Supabase
-- Run once in Supabase SQL Editor.

create extension if not exists pgcrypto;

create table if not exists public.admins (
  user_id uuid primary key references auth.users(id) on delete cascade,
  created_at timestamptz not null default now()
);

create table if not exists public.about_profile (
  id integer primary key check (id = 1),
  heading text not null default '',
  body text not null default '',
  image_path text,
  image_caption text,
  published boolean not null default true,
  updated_at timestamptz not null default now()
);

create table if not exists public.interest_pages (
  id uuid primary key default gen_random_uuid(),
  title text not null,
  slug text not null unique,
  description text not null default '',
  cover_path text,
  sort_order integer not null default 0,
  published boolean not null default false,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists public.content_blocks (
  id uuid primary key default gen_random_uuid(),
  page_id uuid not null references public.interest_pages(id) on delete cascade,
  type text not null check (type in ('text','image','video')),
  content text not null default '',
  media_url text,
  media_path text,
  caption text,
  sort_order integer not null default 0,
  published boolean not null default true,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create or replace function public.is_admin()
returns boolean
language sql
security definer
set search_path = public
stable
as $$
  select exists (
    select 1 from public.admins
    where user_id = auth.uid()
  );
$$;

revoke all on function public.is_admin() from public;
grant execute on function public.is_admin() to anon, authenticated;

alter table public.admins enable row level security;
alter table public.about_profile enable row level security;
alter table public.interest_pages enable row level security;
alter table public.content_blocks enable row level security;

-- Keep grants explicit; RLS then decides which rows each role may touch.
revoke all on table public.admins from anon, authenticated;
grant select on table public.admins to authenticated;

revoke all on table public.about_profile from anon, authenticated;
grant select on table public.about_profile to anon, authenticated;
grant insert, update, delete on table public.about_profile to authenticated;

revoke all on table public.interest_pages from anon, authenticated;
grant select on table public.interest_pages to anon, authenticated;
grant insert, update, delete on table public.interest_pages to authenticated;

revoke all on table public.content_blocks from anon, authenticated;
grant select on table public.content_blocks to anon, authenticated;
grant insert, update, delete on table public.content_blocks to authenticated;

drop policy if exists "admin can read own membership" on public.admins;
create policy "admin can read own membership"
on public.admins for select
to authenticated
using (user_id = auth.uid());

drop policy if exists "public can read published about" on public.about_profile;
create policy "public can read published about"
on public.about_profile for select
to anon, authenticated
using (published = true or public.is_admin());

drop policy if exists "admins manage about" on public.about_profile;
create policy "admins manage about"
on public.about_profile for all
to authenticated
using (public.is_admin())
with check (public.is_admin());

drop policy if exists "public can read published interests" on public.interest_pages;
create policy "public can read published interests"
on public.interest_pages for select
to anon, authenticated
using (published = true or public.is_admin());

drop policy if exists "admins manage interests" on public.interest_pages;
create policy "admins manage interests"
on public.interest_pages for all
to authenticated
using (public.is_admin())
with check (public.is_admin());

drop policy if exists "public can read published blocks" on public.content_blocks;
create policy "public can read published blocks"
on public.content_blocks for select
to anon, authenticated
using (
  (published = true and exists (
    select 1 from public.interest_pages p
    where p.id = page_id and p.published = true
  ))
  or public.is_admin()
);

drop policy if exists "admins manage blocks" on public.content_blocks;
create policy "admins manage blocks"
on public.content_blocks for all
to authenticated
using (public.is_admin())
with check (public.is_admin());

insert into public.about_profile (id, heading, body, published)
values (
  1,
  'Quantitative modelling meets decisions that have to be made anyway.',
  'I came to analytics through finance and capital markets. Recent work has taken me into production scheduling, hospital staffing, logistics, responsible AI, language models, and software. Across those domains, I am most interested in finding the real decision behind the initial problem and carrying the analysis through to something a person can actually use.',
  true
)
on conflict (id) do nothing;

insert into public.interest_pages (title, slug, description, sort_order, published)
values (
  'Teaching',
  'teaching',
  'Mathematics, statistics, programming, and the craft of explaining technical ideas clearly.',
  0,
  true
)
on conflict (slug) do nothing;

insert into storage.buckets (id, name, public)
values ('portfolio-media', 'portfolio-media', true)
on conflict (id) do update set public = true;

drop policy if exists "public media read" on storage.objects;
create policy "public media read"
on storage.objects for select
to public
using (bucket_id = 'portfolio-media');

drop policy if exists "admins upload media" on storage.objects;
create policy "admins upload media"
on storage.objects for insert
to authenticated
with check (bucket_id = 'portfolio-media' and public.is_admin());

drop policy if exists "admins update media" on storage.objects;
create policy "admins update media"
on storage.objects for update
to authenticated
using (bucket_id = 'portfolio-media' and public.is_admin())
with check (bucket_id = 'portfolio-media' and public.is_admin());

drop policy if exists "admins delete media" on storage.objects;
create policy "admins delete media"
on storage.objects for delete
to authenticated
using (bucket_id = 'portfolio-media' and public.is_admin());


-- Curated project assets used by hand-designed case-study pages.
create table if not exists public.project_assets (
  id uuid primary key default gen_random_uuid(),
  project_id text not null,
  asset_key text not null,
  media_path text not null,
  caption text,
  published boolean not null default true,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  unique (project_id, asset_key)
);

alter table public.project_assets enable row level security;

revoke all on table public.project_assets from anon, authenticated;
grant select on table public.project_assets to anon, authenticated;
grant insert, update, delete on table public.project_assets to authenticated;

drop policy if exists "public can read published project assets" on public.project_assets;
create policy "public can read published project assets"
on public.project_assets for select
to anon, authenticated
using (published = true or public.is_admin());

drop policy if exists "admins manage project assets" on public.project_assets;
create policy "admins manage project assets"
on public.project_assets for all
to authenticated
using (public.is_admin())
with check (public.is_admin());
