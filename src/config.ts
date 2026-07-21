/**
 * Interruptores de funcionalidad del sitio.
 *
 * RESERVAS_ENABLED: mientras esté en false, el sitio funciona como página
 * informativa (catálogo de vidriera, ofertas y mapa de la tienda). Todo el
 * circuito de reserva (carrito, checkout, confirmación, "mi reserva") queda
 * oculto pero el código permanece intacto: poner true reactiva el flujo
 * completo sin reconstruir nada.
 */
export const RESERVAS_ENABLED = false
