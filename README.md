# DFSPI Reserva

MVP bilingüe de catálogo y reserva para Duty Free Shop Puerto Iguazú. Incluye catálogo, favoritos, selección, checkout sin pago, código QR, consulta de reserva, chatbot FAQ controlado y panel de operaciones.

## Ejecutar

```bash
npm install
npm run dev
```

La experiencia funciona inmediatamente en modo demo usando `localStorage`. El acceso de demostración al panel es `equipo@dfspi.com` / `dfspi2026`; no debe usarse en producción.

## Backend productivo

1. Crear un proyecto Supabase y ejecutar `supabase/schema.sql`.
2. Crear usuarios internos con Supabase Auth y registrar sus roles en `admin_users`.
3. Desplegar `supabase/functions/send-reservation-email` y configurar `RESEND_API_KEY`, `RESEND_FROM_EMAIL` y `WEBHOOK_SECRET`.
4. Copiar `.env.example` a `.env.local` y completar las variables públicas de Supabase.
5. Reemplazar el adaptador demo por el cliente Supabase al completar la carga inicial del catálogo corporativo.

El procedimiento SQL incluye RLS, reserva transaccional con bloqueo de inventario, devolución idempotente de stock y auditoría. La publicación pública debe realizarse únicamente después de aprobar horarios, precios, textos legales y catálogo.

## Calidad

```bash
npm test
npm run build
```

Los recursos visuales enlazados pertenecen al sitio público actual de DFSPI y deben migrarse al almacenamiento corporativo antes de retirar el WordPress existente.
