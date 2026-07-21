import type { SupabaseClient } from '@supabase/supabase-js'
import type { StoreAdapter } from './store'
import type {
  AdminSession,
  CartItem,
  Category,
  Locale,
  Product,
  Reservation,
  ReservationStatus,
} from './types'

/**
 * Supabase-backed adapter. Reads products/variants/inventory from the public
 * tables, creates reservations through the create_reservation RPC
 * (supabase/schema.sql) and looks reservations up via the get_reservation RPC.
 * The team panel authenticates with Supabase Auth and requires an active row
 * in admin_users.
 */

interface ProductRow {
  id: string
  brand: string
  name: string
  subtitle_es: string
  subtitle_pt: string
  description_es: string
  description_pt: string
  image_url: string
  price_usd: number | string
  original_price_usd: number | string | null
  featured: boolean
  category: { slug: string } | { slug: string }[] | null
  variants: VariantRow[] | null
}

interface VariantRow {
  id: string
  active: boolean
  inventory: { available: number } | { available: number }[] | null
}

const PRODUCT_SELECT =
  'id,brand,name,subtitle_es,subtitle_pt,description_es,description_pt,image_url,price_usd,original_price_usd,featured,' +
  'category:categories(slug),variants:product_variants(id,active,inventory(available))'

const first = <T>(value: T | T[] | null | undefined): T | undefined =>
  Array.isArray(value) ? value[0] : value ?? undefined

function mapProduct(row: ProductRow): Product | null {
  const variant = (row.variants || []).find(v => v.active)
  if (!variant) return null
  const available = first(variant.inventory)?.available ?? 0
  const category = (first(row.category)?.slug || 'perfumes') as Category
  return {
    id: variant.id,
    brand: row.brand,
    name: row.name,
    subtitle: { es: row.subtitle_es, pt: row.subtitle_pt },
    category,
    image: row.image_url,
    price: Number(row.price_usd),
    originalPrice: row.original_price_usd != null ? Number(row.original_price_usd) : undefined,
    stock: available,
    featured: row.featured,
    description: { es: row.description_es, pt: row.description_pt },
  }
}

interface ReservationRow {
  id: string
  code: string
  customer_name: string
  customer_email: string
  customer_phone: string
  pickup_date: string
  expires_at: string
  created_at: string
  status: ReservationStatus
  locale: Locale
  total_usd: number | string
  items: { variant_id: string; quantity: number }[] | null
}

function mapReservation(row: ReservationRow): Reservation {
  return {
    id: row.id,
    code: row.code,
    customer: { name: row.customer_name, email: row.customer_email, phone: row.customer_phone },
    pickupDate: row.pickup_date,
    expiresAt: row.expires_at,
    createdAt: row.created_at,
    status: row.status,
    items: (row.items || []).map(i => ({ productId: i.variant_id, quantity: i.quantity })),
    locale: row.locale,
    total: Number(row.total_usd),
  }
}

async function requireAdminSession(client: SupabaseClient): Promise<AdminSession | null> {
  const { data } = await client.auth.getUser()
  const user = data?.user
  if (!user) return null
  const { data: adminRow } = await client
    .from('admin_users')
    .select('role,active')
    .eq('user_id', user.id)
    .maybeSingle()
  if (!adminRow || !adminRow.active) return null
  return { email: user.email || '', role: adminRow.role }
}

export function createSupabaseAdapter(client: SupabaseClient): StoreAdapter {
  return {
    mode: 'supabase',

    async listProducts() {
      const { data, error } = await client
        .from('products')
        .select(PRODUCT_SELECT)
        .eq('active', true)
        .order('featured', { ascending: false })
      if (error) throw new Error(error.message)
      return ((data || []) as unknown as ProductRow[])
        .map(mapProduct)
        .filter((p): p is Product => p !== null)
    },

    async createReservation(customer, pickupDate, items: CartItem[], locale) {
      const { data, error } = await client.rpc('create_reservation', {
        customer: { name: customer.name, email: customer.email, phone: customer.phone },
        pickup_date: pickupDate,
        items: items.map(i => ({ variant_id: i.productId, quantity: i.quantity })),
        locale,
      })
      if (error || !data) throw new Error(error?.message || 'reservation_failed')
      const result = data as {
        reservationCode: string
        status: ReservationStatus
        expiresAt: string
        total: number | string
      }
      const reservation: Reservation = {
        code: result.reservationCode,
        customer,
        pickupDate,
        expiresAt: result.expiresAt,
        createdAt: new Date().toISOString(),
        status: result.status,
        items,
        locale,
        total: Number(result.total),
      }
      // Fire the confirmation email; a failure here must never break the reservation.
      try {
        await client.functions.invoke('send-reservation-email', {
          body: {
            reservation: {
              code: reservation.code,
              email: customer.email,
              pickupDate,
              locale,
              total: reservation.total,
            },
          },
        })
      } catch {
        // ignored: the reservation is already stored server-side
      }
      return reservation
    },

    async findReservation(code, email) {
      const { data, error } = await client.rpc('get_reservation', {
        lookup_code: code.trim(),
        lookup_email: email.trim().toLowerCase(),
      })
      if (error) throw new Error(error.message)
      if (!data) return null
      return mapReservation(data as ReservationRow)
    },

    adminEnabled() {
      return true
    },

    async signIn(email, password) {
      const { data, error } = await client.auth.signInWithPassword({ email, password })
      if (error || !data?.user) throw new Error('invalid_credentials')
      const session = await requireAdminSession(client)
      if (!session) {
        await client.auth.signOut()
        throw new Error('not_admin')
      }
      return session
    },

    async restoreSession() {
      return requireAdminSession(client)
    },

    async signOut() {
      await client.auth.signOut()
    },

    async listReservations() {
      const { data, error } = await client
        .from('reservations')
        .select(
          'id,code,customer_name,customer_email,customer_phone,pickup_date,expires_at,created_at,status,locale,total_usd,items:reservation_items(variant_id,quantity)',
        )
        .order('created_at', { ascending: false })
      if (error) throw new Error(error.message)
      return ((data || []) as unknown as ReservationRow[]).map(mapReservation)
    },

    async setReservationStatus(code, status) {
      const { data, error } = await client
        .from('reservations')
        .select('id')
        .eq('code', code)
        .single()
      if (error || !data) throw new Error(error?.message || 'not_found')
      const { error: rpcError } = await client.rpc('release_reservation_stock', {
        reservation_id: data.id,
        new_status: status,
      })
      if (rpcError) throw new Error(rpcError.message)
    },

    async setStock(productId, stock) {
      const { error } = await client
        .from('inventory')
        .update({ available: Math.max(0, stock), updated_at: new Date().toISOString() })
        .eq('variant_id', productId)
      if (error) throw new Error(error.message)
    },

    async subscribeNewsletter(email, locale) {
      const { error } = await client
        .from('newsletter_subscribers')
        .upsert({ email: email.trim().toLowerCase(), locale }, { onConflict: 'email' })
      if (error) throw new Error(error.message)
    },
  }
}
