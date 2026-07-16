# DFSPI Reserva

Sitio bilingüe (ES/PT) de catálogo y reserva para Duty Free Shop Puerto Iguazú. Incluye catálogo, favoritos, selección, checkout sin pago, código QR, consulta de reserva, chatbot FAQ controlado y panel de operaciones.

## Ejecutar

```bash
npm install
npm run dev
```

Sin variables de entorno la experiencia corre en **modo demo** usando `localStorage`. Para habilitar el panel del equipo en modo demo definí `VITE_ADMIN_DEMO_PASSWORD` en `.env.local` (cualquier email + esa contraseña). Si no está definida, el panel queda deshabilitado.

## Backend productivo (Supabase)

1. Crear un proyecto Supabase y ejecutar `supabase/schema.sql`.
2. Crear usuarios internos con Supabase Auth y registrar sus roles en `admin_users`.
3. Desplegar `supabase/functions/send-reservation-email` y configurar `RESEND_API_KEY` y `RESEND_FROM_EMAIL`.
4. Copiar `.env.example` a `.env.local`, completar `VITE_SUPABASE_URL` y `VITE_SUPABASE_ANON_KEY`, y poner `VITE_USE_DEMO_DATA=false`.

Con eso el frontend usa el adaptador Supabase automáticamente: catálogo desde las tablas públicas, reservas vía RPC `create_reservation`, consulta vía RPC `get_reservation`, login del panel con Supabase Auth verificando `admin_users` y envío del comprobante por email vía edge function.

El procedimiento SQL incluye RLS, reserva transaccional con bloqueo de inventario, devolución idempotente de stock (solo admins) y auditoría. La publicación pública debe realizarse únicamente después de aprobar horarios, precios, textos legales y catálogo.

## Calidad

```bash
npm test
npm run build
```

El build usa exclusivamente `vite.spa.config.ts` y genera `spa-dist/` (se publica en GitHub Pages con `.github/workflows/deploy-pages.yml`).

Los recursos visuales enlazados pertenecen al sitio público actual de DFSPI y deben migrarse al almacenamiento corporativo antes de retirar el WordPress existente.
