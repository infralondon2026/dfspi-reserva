import { products as seedProducts } from './data'
import { getSupabaseClient, isDemoMode } from './lib/supabase'
import { createSupabaseAdapter } from './store.supabase'
import type { AdminSession, CartItem, Locale, Product, Reservation, ReservationStatus } from './types'

/**
 * Storage adapter contract. Two implementations exist:
 * - demoAdapter: localStorage-backed, used when VITE_USE_DEMO_DATA=true or the
 *   Supabase env vars are missing.
 * - supabaseAdapter (store.supabase.ts): real backend via public tables,
 *   the create_reservation RPC and Supabase Auth.
 */
export interface StoreAdapter {
  readonly mode: 'demo' | 'supabase'
  listProducts(): Promise<Product[]>
  createReservation(
    customer: Reservation['customer'],
    pickupDate: string,
    items: CartItem[],
    locale: Locale,
  ): Promise<Reservation>
  findReservation(code: string, email: string): Promise<Reservation | null>
  /** Whether the team panel can be used at all (demo mode requires VITE_ADMIN_DEMO_PASSWORD). */
  adminEnabled(): boolean
  signIn(email: string, password: string): Promise<AdminSession>
  restoreSession(): Promise<AdminSession | null>
  signOut(): Promise<void>
  listReservations(): Promise<Reservation[]>
  setReservationStatus(code: string, status: ReservationStatus): Promise<void>
  setStock(productId: string, stock: number): Promise<void>
}

// ---------------------------------------------------------------------------
// Demo implementation (localStorage). The synchronous helpers below are also
// exported directly because the unit tests exercise them without the adapter.
// ---------------------------------------------------------------------------

const PRODUCT_KEY = 'dfspi-products-v1'
const RESERVATION_KEY = 'dfspi-reservations-v1'
const DEMO_SESSION_KEY = 'dfspi-admin-session'

export const getProducts = (): Product[] => {
  try {
    return JSON.parse(localStorage.getItem(PRODUCT_KEY) || 'null') || seedProducts
  } catch {
    return seedProducts
  }
}

export const saveProducts = (items: Product[]) =>
  localStorage.setItem(PRODUCT_KEY, JSON.stringify(items))

export const getReservations = (): Reservation[] => {
  try {
    return JSON.parse(localStorage.getItem(RESERVATION_KEY) || '[]')
  } catch {
    return []
  }
}

export const saveReservations = (items: Reservation[]) =>
  localStorage.setItem(RESERVATION_KEY, JSON.stringify(items))

const randomCode = () =>
  `IGZ-${Math.random().toString(36).slice(2, 6).toUpperCase()}-${Math.random().toString(36).slice(2, 6).toUpperCase()}`

export function expireReservations() {
  const now = Date.now()
  const rs = getReservations()
  const ps = getProducts()
  let dirty = false
  rs.forEach(r => {
    if (r.status === 'confirmada' && new Date(r.expiresAt).getTime() < now) {
      r.status = 'vencida'
      r.items.forEach(i => {
        const p = ps.find(x => x.id === i.productId)
        if (p) p.stock += i.quantity
      })
      dirty = true
    }
  })
  if (dirty) {
    saveReservations(rs)
    saveProducts(ps)
  }
}

export function createReservation(
  customer: Reservation['customer'],
  pickupDate: string,
  items: CartItem[],
  locale: Locale,
): Reservation {
  expireReservations()
  const ps = getProducts()
  for (const item of items) {
    const p = ps.find(x => x.id === item.productId)
    if (!p || item.quantity < 1 || item.quantity > p.stock) throw new Error('stock')
  }
  const total = items.reduce(
    (sum, i) => sum + (ps.find(p => p.id === i.productId)?.price || 0) * i.quantity,
    0,
  )
  items.forEach(i => {
    const p = ps.find(x => x.id === i.productId)!
    p.stock -= i.quantity
  })
  const expiresAt = new Date(`${pickupDate}T23:59:59-03:00`).toISOString()
  const reservation: Reservation = {
    code: randomCode(),
    customer,
    pickupDate,
    expiresAt,
    createdAt: new Date().toISOString(),
    status: 'confirmada',
    items,
    locale,
    total,
  }
  saveProducts(ps)
  saveReservations([reservation, ...getReservations()])
  return reservation
}

export const findReservation = (code: string, email: string) => {
  expireReservations()
  return getReservations().find(
    r =>
      r.code.toLowerCase() === code.trim().toLowerCase() &&
      r.customer.email.toLowerCase() === email.trim().toLowerCase(),
  )
}

export function setReservationStatus(code: string, status: ReservationStatus) {
  const rs = getReservations()
  const r = rs.find(x => x.code === code)
  if (!r) return
  const previous = r.status
  if (
    (status === 'cancelada' || status === 'vencida') &&
    !['cancelada', 'vencida', 'retirada'].includes(previous)
  ) {
    const ps = getProducts()
    r.items.forEach(i => {
      const p = ps.find(x => x.id === i.productId)
      if (p) p.stock += i.quantity
    })
    saveProducts(ps)
  }
  r.status = status
  saveReservations(rs)
}

const demoPassword = (): string | undefined => import.meta.env.VITE_ADMIN_DEMO_PASSWORD || undefined

export const demoAdapter: StoreAdapter = {
  mode: 'demo',
  async listProducts() {
    expireReservations()
    return getProducts()
  },
  async createReservation(customer, pickupDate, items, locale) {
    return createReservation(customer, pickupDate, items, locale)
  },
  async findReservation(code, email) {
    return findReservation(code, email) ?? null
  },
  adminEnabled() {
    return Boolean(demoPassword())
  },
  async signIn(email, password) {
    const expected = demoPassword()
    if (!expected) throw new Error('admin_disabled')
    if (!email || password !== expected) throw new Error('invalid_credentials')
    const session: AdminSession = { email, role: 'demo' }
    sessionStorage.setItem(DEMO_SESSION_KEY, JSON.stringify(session))
    return session
  },
  async restoreSession() {
    if (!demoPassword()) return null
    try {
      return JSON.parse(sessionStorage.getItem(DEMO_SESSION_KEY) || 'null')
    } catch {
      return null
    }
  },
  async signOut() {
    sessionStorage.removeItem(DEMO_SESSION_KEY)
  },
  async listReservations() {
    expireReservations()
    return getReservations()
  },
  async setReservationStatus(code, status) {
    setReservationStatus(code, status)
  },
  async setStock(productId, stock) {
    saveProducts(getProducts().map(p => (p.id === productId ? { ...p, stock: Math.max(0, stock) } : p)))
  },
}

// ---------------------------------------------------------------------------
// Active adapter selection
// ---------------------------------------------------------------------------

let activeAdapter: StoreAdapter | undefined

export function getStore(): StoreAdapter {
  if (!activeAdapter) {
    const client = isDemoMode() ? null : getSupabaseClient()
    activeAdapter = client ? createSupabaseAdapter(client) : demoAdapter
  }
  return activeAdapter
}
