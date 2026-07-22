import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
  type ReactNode,
} from 'react'
import { useLocation, useNavigate } from 'react-router-dom'
import { usePersisted } from '../hooks'
import { t, type UiKey } from '../i18n'
import { getStore, type StoreAdapter } from '../store'
import type { CartItem, Locale, Product } from '../types'

// --- Locale -----------------------------------------------------------------

interface LocaleContextValue {
  locale: Locale
  setLocale: (locale: Locale) => void
  tr: (key: UiKey) => string
  path: (target: string) => string
}

const LocaleContext = createContext<LocaleContextValue | null>(null)

// --- Store (products via the active adapter) --------------------------------

interface StoreContextValue {
  store: StoreAdapter
  products: Product[]
  loading: boolean
  reload: () => Promise<void>
}

const StoreContext = createContext<StoreContextValue | null>(null)

// --- Cart & favorites --------------------------------------------------------

interface CartContextValue {
  cart: CartItem[]
  count: number
  add: (productId: string, quantity?: number) => void
  update: (productId: string, quantity: number) => void
  clear: () => void
  favorites: string[]
  toggleFavorite: (productId: string) => void
}

const CartContext = createContext<CartContextValue | null>(null)

// --- Provider ----------------------------------------------------------------

export function AppProvider({ children }: { children: ReactNode }) {
  const location = useLocation()
  const navigate = useNavigate()
  const [storedLocale, setStoredLocale] = usePersisted<Locale>('dfspi-locale', 'es')
  const firstSegment = location.pathname.split('/').filter(Boolean)[0]
  const routeLocale: Locale | undefined = ['es', 'pt', 'en'].includes(firstSegment)
    ? (firstSegment as Locale)
    : undefined
  const locale = routeLocale ?? storedLocale

  useEffect(() => {
    if (routeLocale && routeLocale !== storedLocale) setStoredLocale(routeLocale)
  }, [routeLocale, setStoredLocale, storedLocale])

  const setLocale = useCallback(
    (next: Locale) => {
      setStoredLocale(next)
      const parts = location.pathname.split('/').filter(Boolean)
      if (parts.length && ['es', 'pt', 'en'].includes(parts[0])) parts[0] = next
      else parts.unshift(next)
      const pathname = `/${parts.join('/')}${location.pathname.endsWith('/') ? '/' : ''}`
      navigate(`${pathname}${location.search}${location.hash}`, { replace: true })
    },
    [location.hash, location.pathname, location.search, navigate, setStoredLocale],
  )

  const path = useCallback(
    (target: string) => {
      const normalized = target.startsWith('/') ? target : `/${target}`
      if (normalized === '/') return `/${locale}/`
      return `/${locale}${normalized}`
    },
    [locale],
  )
  const tr = useCallback((key: UiKey) => t(locale, key), [locale])

  const store = useMemo(() => getStore(), [])
  const [products, setProducts] = useState<Product[]>([])
  const [loading, setLoading] = useState(true)
  const reload = useCallback(async () => {
    try {
      setProducts(await store.listProducts())
    } catch {
      // keep the last known catalog on transient failures
    } finally {
      setLoading(false)
    }
  }, [store])
  useEffect(() => {
    void reload()
  }, [reload])

  const [cart, setCart] = usePersisted<CartItem[]>('dfspi-cart', [])
  const [favorites, setFavorites] = usePersisted<string[]>('dfspi-favorites', [])

  const add = useCallback(
    (productId: string, quantity = 1) => {
      setCart(current => {
        const stock = products.find(p => p.id === productId)?.stock ?? Infinity
        const found = current.find(i => i.productId === productId)
        if (found) {
          return current.map(i =>
            i.productId === productId
              ? { ...i, quantity: Math.min(i.quantity + quantity, stock) }
              : i,
          )
        }
        return [...current, { productId, quantity: Math.min(quantity, stock) }]
      })
    },
    [products, setCart],
  )

  const update = useCallback(
    (productId: string, quantity: number) => {
      setCart(current => {
        if (quantity < 1) return current.filter(i => i.productId !== productId)
        const stock = products.find(p => p.id === productId)?.stock ?? quantity
        return current.map(i =>
          i.productId === productId ? { ...i, quantity: Math.min(quantity, stock) } : i,
        )
      })
    },
    [products, setCart],
  )

  const clear = useCallback(() => setCart([]), [setCart])

  const toggleFavorite = useCallback(
    (productId: string) =>
      setFavorites(current =>
        current.includes(productId)
          ? current.filter(id => id !== productId)
          : [...current, productId],
      ),
    [setFavorites],
  )

  const localeValue = useMemo(() => ({ locale, setLocale, tr, path }), [locale, setLocale, tr, path])
  const storeValue = useMemo(
    () => ({ store, products, loading, reload }),
    [store, products, loading, reload],
  )
  const cartValue = useMemo(
    () => ({
      cart,
      count: cart.reduce((sum, item) => sum + item.quantity, 0),
      add,
      update,
      clear,
      favorites,
      toggleFavorite,
    }),
    [cart, add, update, clear, favorites, toggleFavorite],
  )

  return (
    <LocaleContext.Provider value={localeValue}>
      <StoreContext.Provider value={storeValue}>
        <CartContext.Provider value={cartValue}>{children}</CartContext.Provider>
      </StoreContext.Provider>
    </LocaleContext.Provider>
  )
}

// --- Hooks --------------------------------------------------------------------

function useRequired<T>(context: T | null, name: string): T {
  if (!context) throw new Error(`${name} must be used within <AppProvider>`)
  return context
}

export const useLocale = () => useRequired(useContext(LocaleContext), 'useLocale')
export const useStoreData = () => useRequired(useContext(StoreContext), 'useStoreData')
export const useCart = () => useRequired(useContext(CartContext), 'useCart')
