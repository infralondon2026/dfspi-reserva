-- DFSPI — tabla de suscriptores al newsletter.
-- Ejecutar en el SQL Editor de Supabase (después de schema.sql). Idempotente.

create table if not exists public.newsletter_subscribers (
  id uuid primary key default gen_random_uuid(),
  email text unique not null,
  locale text not null default 'es' check (locale in ('es', 'pt')),
  created_at timestamptz not null default now()
);

alter table public.newsletter_subscribers enable row level security;

-- El público puede suscribirse (insert), pero nadie anónimo puede leer la lista.
drop policy if exists "public newsletter signup" on public.newsletter_subscribers;
create policy "public newsletter signup"
  on public.newsletter_subscribers for insert
  to anon, authenticated
  with check (true);

-- Solo administradores pueden leer los suscriptores.
drop policy if exists "admins read subscribers" on public.newsletter_subscribers;
create policy "admins read subscribers"
  on public.newsletter_subscribers for select
  using (public.is_admin());
