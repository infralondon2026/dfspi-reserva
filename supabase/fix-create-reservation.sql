create or replace function public.create_reservation(customer jsonb,pickup_date date,items jsonb,locale text)
returns jsonb language plpgsql security definer set search_path=public as $$
declare r reservations; item jsonb; inv inventory; variant product_variants; product products; total numeric:=0; new_code text;
begin
 -- Validate against the store's local calendar (America/Argentina/Buenos_Aires), not the server's UTC date.
 if locale not in ('es','pt') or pickup_date <= (now() at time zone 'America/Argentina/Buenos_Aires')::date or pickup_date > (now() at time zone 'America/Argentina/Buenos_Aires')::date+7 then raise exception 'invalid_request'; end if;
 if jsonb_array_length(items)=0 or jsonb_array_length(items)>25 then raise exception 'invalid_items'; end if;
 if coalesce(customer->>'name','')='' or coalesce(customer->>'email','')='' or coalesce(customer->>'phone','')='' then raise exception 'invalid_customer'; end if;
 for item in select * from jsonb_array_elements(items) loop
  select * into variant from product_variants where id=(item->>'variant_id')::uuid and active;
  select * into product from products where id=variant.product_id and active;
  select * into inv from inventory where variant_id=variant.id for update;
  if variant.id is null or product.id is null or (item->>'quantity')::int<1 or inv.available<(item->>'quantity')::int then raise exception 'insufficient_stock'; end if;
  total:=total+product.price_usd*(item->>'quantity')::int;
 end loop;
 -- md5(gen_random_uuid()) avoids depending on pgcrypto, which Supabase installs
 -- outside this function's search_path.
 new_code:='IGZ-'||upper(substr(md5(gen_random_uuid()::text),1,4))||'-'||upper(substr(md5(gen_random_uuid()::text),1,4));
 insert into reservations(code,customer_name,customer_email,customer_phone,pickup_date,expires_at,locale,total_usd)
 -- expires_at = end of the pickup day in -03:00, consistent with the frontend demo store.
 values(new_code,customer->>'name',lower(customer->>'email'),customer->>'phone',pickup_date,(pickup_date::text||' 23:59:59-03')::timestamptz,locale,total) returning * into r;
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
