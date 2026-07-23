# Guía de colaboración — DFSPI

Este repo publica el sitio del Duty Free Shop Puerto Iguazú en producción
(GitHub Pages). **La rama `main` está protegida y se despliega sola con cada
cambio que se mergea.** Por eso todos los cambios entran por Pull Request (PR)
con la validación automática en verde. Estas reglas valen para todo el mundo:
personas y herramientas de IA (Claude, Codex, etc.).

## Puesta en marcha

Requisitos: Node 24 y npm.

```bash
git clone https://github.com/infralondon2026/dfspi-reserva.git
cd dfspi-reserva
npm install
cp .env.example .env.local   # completar solo si trabajás contra Supabase real
npm run dev                  # http://localhost:5173
```

Sin variables de entorno el sitio corre en **modo demo** (datos locales), ideal
para desarrollar sin tocar producción.

## Flujo de trabajo (importante)

1. **Antes de empezar, traé lo último:**
   ```bash
   git checkout main
   git pull
   ```
2. **Creá una rama** para tu cambio (nunca trabajes directo sobre `main`):
   ```bash
   git checkout -b freddy/promos-bancarias
   ```
   Usá un nombre corto y descriptivo: `tu-nombre/que-cambias`.
3. Hacé tus cambios y **verificá que todo pasa** antes de subir:
   ```bash
   npm test
   npm run build
   ```
   Si alguno falla, no subas: arreglalo primero.
4. Commit y push de tu rama:
   ```bash
   git add -A
   git commit -m "Agrega promociones bancarias de agosto"
   git push -u origin freddy/promos-bancarias
   ```
5. Abrí un **Pull Request** hacia `main` en GitHub. La validación automática
   (tests + build) corre sola; esperá a que esté en **verde**.
6. Cuando el PR está aprobado y en verde, **mergealo**. Ahí `main` se despliega
   solo a producción en ~1–2 minutos.

> No se puede pushear directo a `main`: GitHub lo va a rechazar. Siempre por PR.

## Reglas de oro

- **Nunca subas secretos.** Contraseñas, claves de Supabase de servicio, tokens,
  API keys → van como *Variables/Secrets* de GitHub Actions, nunca en el código.
  El `.env` y los `*.docx`/`*.pdf` ya están ignorados por git.
- **Verificá antes de subir** (`npm test && npm run build`). Un PR que no compila
  no se mergea.
- **Un cambio = una rama = un PR.** Más fácil de revisar y de revertir si algo sale mal.
- **Si usás una IA (Claude/Codex), pedile que corra los tests y el build** antes
  de proponer el PR, y revisá el diff antes de mergear.

## Dónde editar cada cosa (sin tocar lógica)

La mayoría de las actualizaciones de contenido se hacen en pocos archivos:

| Querés cambiar… | Editá este archivo |
|---|---|
| Promos bancarias, servicios, novedades, medios de pago, redes sociales | `src/siteContent.ts` |
| Sectores y marcas del mapa de la tienda | `src/storeMap.ts` |
| Textos del sitio (ES / PT / EN) | `src/i18n.ts` |
| Catálogo (productos, precios, fotos) | Panel `/equipo` o la base Supabase (o `src/data.ts` en modo demo) |
| Imágenes | `public/img/` (rutas relativas, no hotlinkear otros sitios) |

Reactivar el circuito de reserva a futuro: poner `RESERVAS_ENABLED = true` en
`src/config.ts`.

## Estructura rápida

- `src/pages/` — páginas (una por archivo)
- `src/components/` — componentes reutilizables
- `src/context/AppContext.tsx` — idioma, catálogo y estado global
- `src/store.ts` / `src/store.supabase.ts` — acceso a datos (demo y Supabase)
- `supabase/` — schema, seed y edge functions
- `.github/workflows/` — CI (validación en PRs) y deploy a Pages

## Ayuda

Dudas de acceso (GitHub, Supabase) o para altas de usuarios del panel:
contactar al área de IT.
