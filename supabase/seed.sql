-- DFSPI seed — catálogo inicial (mismos productos del modo demo).
-- Ejecutar DESPUÉS de schema.sql, en el SQL Editor de Supabase.
-- Es idempotente: se puede volver a correr sin duplicar filas.

with cats as (
  insert into public.categories (slug, name_es, name_pt, sort_order) values
    ('perfumes', 'Perfumes', 'Perfumes', 1),
    ('bebidas', 'Bebidas', 'Bebidas', 2),
    ('delicatessen', 'Delicatessen', 'Delicatessen', 3),
    ('tecnologia', 'Tecnología', 'Tecnologia', 4)
  on conflict (slug) do update set sort_order = excluded.sort_order
  returning id, slug
)
select 1;

-- Productos ------------------------------------------------------------------

insert into public.products
  (category_id, sku, brand, name, subtitle_es, subtitle_pt, description_es, description_pt, image_url, price_usd, original_price_usd, featured)
values
  ((select id from public.categories where slug='perfumes'), 'ch-212', 'Carolina Herrera', '212 VIP Rosé Elixir',
   'Eau de Parfum · 50 ml', 'Eau de Parfum · 50 ml',
   'Una fragancia floral intensa y luminosa, perfecta para celebrar cada viaje.',
   'Uma fragrância floral intensa e luminosa, perfeita para celebrar cada viagem.',
   'https://dutyfreeshoppuertoiguazu.com/wp-content/uploads/2026/02/WhatsApp-Image-2026-02-02-at-12.21.39-PM.jpeg', 89, 109, true),
  ((select id from public.categories where slug='perfumes'), 'armani-way', 'Giorgio Armani', 'My Way',
   'Eau de Parfum · 90 ml', 'Eau de Parfum · 90 ml',
   'Un bouquet floral contemporáneo con notas de azahar y vainilla.',
   'Um buquê floral contemporâneo com notas de flor de laranjeira e baunilha.',
   'https://dutyfreeshoppuertoiguazu.com/wp-content/uploads/2026/02/WhatsApp-Image-2026-02-02-at-12.21.39-PM-1.jpeg', 118, null, true),
  ((select id from public.categories where slug='perfumes'), 'amor-amor', 'Cacharel', 'Amor Amor',
   'Eau de Toilette · 50 ml', 'Eau de Toilette · 50 ml',
   'Frutal y vibrante, un clásico joven con personalidad.',
   'Frutado e vibrante, um clássico jovem com personalidade.',
   'https://dutyfreeshoppuertoiguazu.com/wp-content/uploads/2026/02/WhatsApp-Image-2026-02-02-at-12.21.40-PM.jpeg', 64, 76, true),
  ((select id from public.categories where slug='perfumes'), 'moncler-sunrise', 'Moncler', 'Sunrise Pour Homme',
   'Eau de Parfum · 100 ml', 'Eau de Parfum · 100 ml',
   'Amaderada y sofisticada, inspirada en la energía de la montaña.',
   'Amadeirada e sofisticada, inspirada na energia da montanha.',
   'https://dutyfreeshoppuertoiguazu.com/wp-content/uploads/2026/02/WhatsApp-Image-2026-02-02-at-12.21.40-PM-1.jpeg', 132, null, true),
  ((select id from public.categories where slug='bebidas'), 'chivas-12', 'Chivas Regal', 'Chivas Regal 12 Years',
   'Blended Scotch Whisky · 1 L', 'Blended Scotch Whisky · 1 L',
   'Whisky escocés suave, con notas de miel, vainilla y frutas maduras.',
   'Whisky escocês suave, com notas de mel, baunilha e frutas maduras.',
   'https://dutyfreeshoppuertoiguazu.com/wp-content/uploads/2024/12/Destacados_bebidas2.png', 39, 46, true),
  ((select id from public.categories where slug='bebidas'), 'jw-black', 'Johnnie Walker', 'Black Label 12 Years',
   'Blended Scotch Whisky · 1 L', 'Blended Scotch Whisky · 1 L',
   'Profundo y equilibrado, con carácter ahumado.',
   'Profundo e equilibrado, com caráter defumado.',
   'https://dutyfreeshoppuertoiguazu.com/wp-content/uploads/2024/12/Destacados_bebidas1.png', 42, null, false),
  ((select id from public.categories where slug='bebidas'), 'jager', 'Jägermeister', 'Herb Liqueur',
   'Licor de hierbas · 1 L', 'Licor de ervas · 1 L',
   'La receta icónica de 56 botánicos.', 'A receita icônica de 56 botânicos.',
   'https://dutyfreeshoppuertoiguazu.com/wp-content/uploads/2024/12/Destacados_bebidas3.png', 25, null, false),
  ((select id from public.categories where slug='bebidas'), 'amarula', 'Amarula', 'Cream Liqueur',
   'Licor crema · 750 ml', 'Licor cremoso · 750 ml',
   'Cremoso y suave, elaborado con fruta marula.', 'Cremoso e suave, elaborado com a fruta marula.',
   'https://dutyfreeshoppuertoiguazu.com/wp-content/uploads/2024/12/Destacados_bebidas4.png', 18, null, false),
  ((select id from public.categories where slug='delicatessen'), 'lindt-gold', 'Lindt', 'Swiss Luxury Selection',
   'Bombones surtidos · 230 g', 'Bombons sortidos · 230 g',
   'Selección premium de chocolates suizos.', 'Seleção premium de chocolates suíços.',
   'https://dutyfreeshoppuertoiguazu.com/wp-content/uploads/2025/03/Lindt.png', 22, null, false),
  ((select id from public.categories where slug='tecnologia'), 'airpods', 'Apple', 'AirPods Pro',
   '2ª generación · USB-C', '2ª geração · USB-C',
   'Audio adaptativo y cancelación activa de ruido.', 'Áudio adaptativo e cancelamento ativo de ruído.',
   'https://dutyfreeshoppuertoiguazu.com/wp-content/uploads/2025/03/appleMac.png', 249, null, false)
on conflict (sku) do update set
  price_usd = excluded.price_usd,
  original_price_usd = excluded.original_price_usd,
  featured = excluded.featured,
  image_url = excluded.image_url;

-- Variantes (una por producto, misma etiqueta que el subtítulo) ----------------

insert into public.product_variants (product_id, sku, label_es, label_pt)
select p.id, p.sku || '-std', p.subtitle_es, p.subtitle_pt
from public.products p
on conflict (sku) do nothing;

-- Inventario inicial ------------------------------------------------------------

insert into public.inventory (variant_id, available)
select v.id,
  case p.sku
    when 'ch-212' then 8
    when 'armani-way' then 5
    when 'amor-amor' then 12
    when 'moncler-sunrise' then 3
    when 'chivas-12' then 18
    when 'jw-black' then 14
    when 'jager' then 10
    when 'amarula' then 16
    when 'lindt-gold' then 20
    when 'airpods' then 4
    else 0
  end
from public.product_variants v
join public.products p on p.id = v.product_id
on conflict (variant_id) do nothing;

-- FAQs ----------------------------------------------------------------------------

insert into public.faqs (question_es, question_pt, answer_es, answer_pt, keywords_es, keywords_pt, sort_order)
select * from (values
  ('¿Cómo funciona la reserva?', 'Como funciona a reserva?',
   'Elegí tus productos, seleccioná una fecha dentro de los próximos 7 días y confirmá. No pagás online: abonás al retirar presentando tu código y documentación.',
   'Escolha os produtos, selecione uma data nos próximos 7 dias e confirme. Você não paga online: paga na retirada apresentando o código e a documentação.',
   array['reservar','reserva','funciona','comprar'], array['reservar','reserva','funciona','comprar'], 1),
  ('¿Cuáles son los horarios?', 'Quais são os horários?',
   'Abrimos todos los días de 12:00 a 20:00, hora argentina. Los horarios especiales se informan en este sitio.',
   'Abrimos todos os dias das 12h às 20h, horário argentino. Horários especiais são informados neste site.',
   array['horario','hora','abren','cierran'], array['horario','hora','abrem','fecham'], 2),
  ('¿Dónde retiro mi reserva?', 'Onde retiro minha reserva?',
   'En Duty Free Shop Puerto Iguazú, Ruta Nacional 12 km 1645,5, Paso de Frontera. Presentá el QR en el punto de Reservas Online.',
   'No Duty Free Shop Puerto Iguazú, Ruta Nacional 12 km 1645,5, fronteira. Apresente o QR no ponto de Reservas Online.',
   array['donde','ubicacion','retirar','direccion'], array['onde','localizacao','retirar','endereco'], 3),
  ('¿Qué medios de pago aceptan?', 'Quais meios de pagamento aceitam?',
   'En tienda podés pagar con Visa, Mastercard, Amex, débito, PIX y efectivo en USD, ARS o BRL. La reserva no requiere pago previo.',
   'Na loja você pode pagar com Visa, Mastercard, Amex, débito, PIX e dinheiro em USD, ARS ou BRL. A reserva não exige pagamento antecipado.',
   array['pago','tarjeta','efectivo','pix','precio'], array['pagamento','cartao','dinheiro','pix','preco'], 4),
  ('¿Hasta cuándo guardan mi reserva?', 'Até quando guardam minha reserva?',
   'La guardamos hasta el cierre de la fecha de retiro elegida. Después se libera automáticamente el stock.',
   'Guardamos até o fechamento da data escolhida para retirada. Depois o estoque é liberado automaticamente.',
   array['vence','vencimiento','guardar'], array['vence','vencimento','guardar'], 5),
  ('¿Qué documentación necesito?', 'Quais documentos são necessários?',
   'Para ingresar al predio debés registrar la salida en la aduana de tu país de procedencia y presentar la documentación migratoria exigida.',
   'Para entrar, você deve registrar a saída na aduana do país de origem e apresentar a documentação migratória exigida.',
   array['documento','aduana','dni','pasaporte','ingresar'], array['documento','aduana','passaporte','entrar'], 6)
) as f(question_es, question_pt, answer_es, answer_pt, keywords_es, keywords_pt, sort_order)
where not exists (select 1 from public.faqs);
