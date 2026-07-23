/*
 * Service worker de DFSPI — caché conservador para carga rápida y modo offline.
 * - Navegación: network-first (siempre trae lo último; si no hay red, cae al caché
 *   o a la home), así un deploy nuevo nunca queda "pegado" en una versión vieja.
 * - Assets con hash (JS/CSS/imágenes): stale-while-revalidate.
 * - Nunca cachea otros orígenes (fuentes de Google, Supabase, etc.).
 */
const CACHE = 'dfspi-cache-v1'
const SCOPE_URL = new URL(self.registration.scope)
const HOME = SCOPE_URL.pathname // p. ej. /dfspi-reserva/

self.addEventListener('install', () => {
  self.skipWaiting()
})

self.addEventListener('activate', event => {
  event.waitUntil(
    (async () => {
      const keys = await caches.keys()
      await Promise.all(keys.filter(key => key !== CACHE).map(key => caches.delete(key)))
      await self.clients.claim()
    })(),
  )
})

self.addEventListener('fetch', event => {
  const { request } = event
  if (request.method !== 'GET') return
  const url = new URL(request.url)
  if (url.origin !== self.location.origin) return // no tocar terceros

  if (request.mode === 'navigate') {
    event.respondWith(
      (async () => {
        try {
          return await fetch(request)
        } catch {
          const cache = await caches.open(CACHE)
          return (await cache.match(request)) || (await cache.match(HOME)) || Response.error()
        }
      })(),
    )
    return
  }

  event.respondWith(
    (async () => {
      const cache = await caches.open(CACHE)
      const cached = await cache.match(request)
      const network = fetch(request)
        .then(response => {
          if (response.ok) cache.put(request, response.clone())
          return response
        })
        .catch(() => cached)
      return cached || network
    })(),
  )
})
