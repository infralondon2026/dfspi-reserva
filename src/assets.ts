/** Resolves a public/ asset path against the deploy base (/, /dfspi-reserva/, etc.). */
export const asset = (path: string) => import.meta.env.BASE_URL + path

/**
 * Product images are stored as paths relative to the site root (e.g. "img/ch-212.jpeg")
 * so they survive domain/base changes; absolute URLs pass through untouched.
 */
export const resolveImage = (url: string) => (url.startsWith('http') ? url : asset(url))

export const logo = asset('img/logo.png')

export const hero = asset('img/portada-web.jpeg')

export const storeAddress = 'Ruta Nacional 12, km 1645,5'
export const storeCity = 'Puerto Iguazú, Misiones'
export const storePhone = '+54 3757 421050'
export const storeEmail = 'info@dfspi.com'
export const mapsUrl =
  'https://www.google.com/maps/search/?api=1&query=Duty+Free+Shop+Puerto+Iguazu'
