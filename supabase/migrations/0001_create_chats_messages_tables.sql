-- Enable pgcrypto extension for gen_random_uuid()
create extension if not exists pgcrypto;

-- Create chats table
create table if not exists public.chats (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references public.profiles(id) on delete cascade,
  name text not null,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

-- Create messages table
create table if not exists public.messages (
  id uuid primary key default gen_random_uuid(),
  chat_id uuid not null references public.chats(id) on delete cascade,
  user_id uuid not null references public.profiles(id) on delete cascade,
  sender text not null check (sender in ('user','ai')),
  content text not null,
  model_id text,
  created_at timestamptz not null default now()
);

-- Enable Row Level Security
alter table public.chats enable row level security;
alter table public.messages enable row level security;

-- Policies for chats
create policy "Select own chats" on public.chats
  for select using ( auth.uid() = user_id );
create policy "Insert own chats" on public.chats
  for insert with check ( auth.uid() = user_id );
create policy "Update own chats" on public.chats
  for update using ( auth.uid() = user_id ) with check ( auth.uid() = user_id );
create policy "Delete own chats" on public.chats
  for delete using ( auth.uid() = user_id );

-- Policies for messages
create policy "Select own messages" on public.messages
  for select using (
    exists (
      select 1 from public.chats c where c.id = public.messages.chat_id and c.user_id = auth.uid()
    )
  );
create policy "Insert own messages" on public.messages
  for insert with check ( auth.uid() = user_id );
create policy "Update own messages" on public.messages
  for update using ( auth.uid() = user_id ) with check ( auth.uid() = user_id );
create policy "Delete own messages" on public.messages
  for delete using ( auth.uid() = user_id );