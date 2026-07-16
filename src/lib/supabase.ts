import { createClient, type SupabaseClient } from '@supabase/supabase-js'

export interface SupabaseConfig {
  url: string
  anonKey: string
}

let cachedClient: SupabaseClient | null | undefined

export function getSupabaseConfig(): SupabaseConfig | null {
  const url = import.meta.env.VITE_SUPABASE_URL
  const anonKey = import.meta.env.VITE_SUPABASE_ANON_KEY
  if (!url || !anonKey) return null
  return { url, anonKey }
}

export function isDemoMode(): boolean {
  if (import.meta.env.VITE_USE_DEMO_DATA === 'true') return true
  return getSupabaseConfig() === null
}

export function getSupabaseClient(): SupabaseClient | null {
  if (cachedClient !== undefined) return cachedClient
  const config = getSupabaseConfig()
  cachedClient = config ? createClient(config.url, config.anonKey) : null
  return cachedClient
}
