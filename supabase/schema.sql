-- DFSPI reservation MVP — run in a new Supabase project.
create extension if not exists pgcrypto;

create type public.reservation_status as enum ('confirmada','lista_para_retirar','retirada','cancelada','vencida');
create type public.app_role as enum ('content_manager','operations','admin');

create table public.categories (
  id uuid primary key default gen_random_uuid(), slug text unique not null,
  name_es text not null, name_pt text not null, sort_order integer not null default 0,
  active boolean not null default true, created_at timestamptz not null default now()
);
create table public.products (
  id uuid primary key default gen_random_uuid(), category_id uuid references public.categories(id), sku text unique not null,
  brand text not null, name text not null, subtitle_es text not null, subtitle_pt text not null,
  description_es text not null default '', description_pt text not null default '', image_url text not null,
  price_usd numeric(10,2) not null check(price_usd>=0), original_price_usd numeric(10,2), featured boolean not null default false,
  active boolean not null default true, created_at timestamptz not null default now(), updated_at timestamptz not null default now()
);
create table public.product_variants (
  id uuid primary key default gen_random_uuid(), product_id uuid not null references public.products(id) on delete cascade,
  sku text unique not null, label_es text not null, label_pt text not null, active boolean not null default true
);
create table public.inventory (
  variant_id uuid primary key references public.product_variants(id) on delete cascade,
  available integer not null default 0 check(available>=0), updated_at timestamptz not null default now()
);
create table public.reservations (
  id uuid primary key default gen_random_uuid(), code text unique not null,
  customer_name text not null, customer_email text not null, customer_phone text not null,
  pickup_date date not null, expires_at timestamptz not null, status public.reservation_status not null default 'confirmada',
  locale text not null check(locale in ('es','pt')), total_usd numeric(10,2) not null,
  privacy_accepted_at timestamptz not null default now(), created_at timestamptz not null default now(), updated_at timestamptz not null default now()
);
create table public.reservation_items (
  id uuid primary key default gen_random_uuid(), reservation_id uuid not null references public.reservations(id) on delete cascade,
  variant_id uuid not null references public.product_variants(id), quantity integer not null check(quantity>0),
  unit_price_usd numeric(10,2) not null, product_snapshot jsonb not null
);
create table public.faqs (
  id uuid primary key default gen_random_uuid(), question_es text not null, question_pt text not null,
  answer_es text not null, answer_pt text not null, keywords_es text[] not null default '{}', keywords_pt text[] not null default '{}',
  sort_order integer not null default 0, active boolean not null default true, updated_at timestamptz not null default now()
);
create table public.admin_users (
  user_id uuid primary key references auth.users(id) on delete cascade, role public.app_role not null, active boolean not null default true
);
create table public.audit_log (
  id bigint generated always as identity primary key, actor_id uuid references auth.users(id), action text not null,
  entity_type text not null, entity_id text, before_data jsonb, after_data jsonb, created_at timestamptz not null default now()
);

alter table public.categories enable row level security; alter table public.products enable row level security;
alter table public.product_variants enable row level security; alter table public.inventory enable row level security;
alter table public.reservations enable row level security; alter table public.reservation_items enable row level security;
alter table public.faqs enable row level security; alter table public.admin_users enable row level security; alter table public.audit_log enable row level security;

create policy "public active categories" on public.categories for select using(active);
create policy "public active products" on public.products for select using(active);
create policy "public active variants" on public.product_variants for select using(active);
create policy "public inventory read" on public.inventory for select using(true);
create policy "public active faqs" on public.faqs for select using(active);
create function public.is_admin() returns boolean language sql stable security definer set search_path=public as $$select exists(select 1 from admin_users where user_id=auth.uid() and active)$$;
create policy "admins categories" on public.categories for all using(public.is_admin()) with check(public.is_admin());
create policy "admins products" on public.products for all using(public.is_admin()) with check(public.is_admin());
create policy "admins variants" on public.product_variants for all using(public.is_admin()) with check(public.is_admin());
create policy "admins inventory" on public.inventory for all using(public.is_admin()) with check(public.is_admin());
create policy "admins reservations" on public.reservations for all using(public.is_admin()) with check(public.is_admin());
create policy "admins reservation items" on public.reservation_items for all using(public.is_admin()) with check(public.is_admin());
create policy "admins faqs" on public.faqs for all using(public.is_admin()) with check(public.is_admin());
create policy "admins audit read" on public.audit_log for select using(public.is_admin());

create or replace function public.create_reservation(customer jsonb,pickup_date date,items jsonb,locale text)
returns jsonb language plpgsql security definer set search_path=public as $$
declare r reservations; item jsonb; inv inventory; variant product_variants; product products; total numeric:=0; new_code text;
begin
 if locale not in ('es','pt') or pickup_date <= current_date or pickup_date > current_date+7 then raise exception 'invalid_request'; end if;
 if jsonb_array_length(items)=0 or jsonb_array_length(items)>25 then raise exception 'invalid_items'; end if;
 if coalesce(customer->>'name','')='' or coalesce(customer->>'email','')='' or coalesce(customer->>'phone','')='' then raise exception 'invalid_customer'; end if;
 for item in select * from jsonb_array_elements(items) loop
  select * into variant from product_variants where id=(item->>'variant_id')::uuid and active;
  select * into product from products where id=variant.product_id and active;
  select * into inv from inventory where variant_id=variant.id for update;
  if variant.id is null or product.id is null or (item->>'quantity')::int<1 or inv.available<(item->>'quantity')::int then raise exception 'insufficient_stock'; end if;
  total:=total+product.price_usd*(item->>'quantity')::int;
 end loop;
 new_code:='IGZ-'||upper(substr(encode(gen_random_bytes(5),'hex'),1,4))||'-'||upper(substr(encode(gen_random_bytes(5),'hex'),1,4));
 insert into reservations(code,customer_name,customer_email,customer_phone,pickup_date,expires_at,locale,total_usd)
 values(new_code,customer->>'name',lower(customer->>'email'),customer->>'phone',pickup_date,(pickup_date+1)::timestamptz,locale,total) returning * into r;
 for item in select * from jsonb_array_elements(items) loop
  select v.* into variant from product_variants v where v.id=(item->>'variant_id')::uuid;
  select p.* into product from products p where p.id=variant.product_id;
  update inventory set available=available-(item->>'quantity')::int,updated_at=now() where variant_id=variant.id;
  insert into reservation_items(reservation_id,variant_id,quantity,unit_price_usd,product_snapshot)
  values(r.id,variant.id,(item->>'quantity')::int,product.price_usd,jsonb_build_object('brand',product.brand,'name',product.name,'sku',variant.sku));
 end loop;
 return jsonb_build_object('reservationCode',r.code,'status',r.status,'expiresAt',r.expires_at,'total',r.total_usd);
end $$;
revoke all on function public.create_reservation(jsonb,date,jsonb,text) from public;
grant execute on function public.create_reservation(jsonb,date,jsonb,text) to anon,authenticated;

create or replace function public.release_reservation_stock(reservation_id uuid,new_status reservation_status)
returns void language plpgsql security definer set search_path=public as $$
declare current reservations; begin
 select * into current from reservations where id=reservation_id for update;
 if current.status in ('cancelada','vencida','retirada') then return; end if;
 if new_status in ('cancelada','vencida') then update inventory i set available=i.available+ri.quantity,updated_at=now() from reservation_items ri where ri.reservation_id=current.id and ri.variant_id=i.variant_id; end if;
 update reservations set status=new_status,updated_at=now() where id=current.id;
end $$;

create index reservations_lookup on public.reservations(code,lower(customer_email));
create index reservations_expiry on public.reservations(expires_at) where status='confirmada';
