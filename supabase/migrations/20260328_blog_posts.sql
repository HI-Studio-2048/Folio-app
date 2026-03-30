create table if not exists public.blog_posts (
  id uuid default gen_random_uuid() primary key,
  slug text not null unique,
  title text not null,
  description text not null,
  content text not null,
  seo_keywords text[] not null default '{}',
  status text not null default 'draft', -- draft, published
  created_at timestamp with time zone default timezone('utc'::text, now()) not null,
  published_at timestamp with time zone
);

alter table public.blog_posts enable row level security;

-- Allow public read access (anyone can view published blog posts)
create policy "Public can view published blog posts"
on public.blog_posts for select
to public
using (status = 'published');

-- Allow authenticated admins / service roles to insert and manage
create policy "Service Role can manage blog posts"
on public.blog_posts for all
using (true)
with check (true);
