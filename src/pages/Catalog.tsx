import { useMemo, useState } from 'react'
import { useSearchParams } from 'react-router-dom'
import { Info, Search } from 'lucide-react'
import ProductCard, { ProductCardSkeleton } from '../components/ProductCard'
import { RESERVAS_ENABLED } from '../config'
import { useLocale, useStoreData } from '../context/AppContext'
import type { UiKey } from '../i18n'
import type { Category, Product } from '../types'

type CategoryFilter = 'all' | Category
type SortMode = 'recommended' | 'priceAsc' | 'priceDesc' | 'discount'

const CATEGORIES: [CategoryFilter, UiKey][] = [
  ['all', 'all'],
  ['perfumes', 'perfumes'],
  ['bebidas', 'bebidas'],
  ['delicatessen', 'delicatessen'],
  ['tecnologia', 'tecnologia'],
]

const SORTS: [SortMode, UiKey][] = [
  ['recommended', 'sortRecommended'],
  ['priceAsc', 'sortPriceAsc'],
  ['priceDesc', 'sortPriceDesc'],
  ['discount', 'sortDiscount'],
]

const discountOf = (p: Product) => (p.originalPrice ? 1 - p.price / p.originalPrice : 0)

export default function Catalog() {
  const { tr } = useLocale()
  const { products, loading } = useStoreData()
  const [params, setParams] = useSearchParams()
  const [query, setQuery] = useState('')
  const [sort, setSort] = useState<SortMode>('recommended')
  const availableSorts = RESERVAS_ENABLED ? SORTS : SORTS.filter(([id]) => id === 'recommended')

  const rawCategory = params.get('cat')
  const category: CategoryFilter = CATEGORIES.some(([id]) => id === rawCategory)
    ? (rawCategory as CategoryFilter)
    : 'all'

  const setCategory = (next: CategoryFilter) =>
    setParams(next === 'all' ? {} : { cat: next }, { replace: true })

  const filtered = useMemo(() => {
    const needle = query.toLowerCase()
    const matches = products.filter(
      p =>
        (category === 'all' || p.category === category) &&
        `${p.brand} ${p.name}`.toLowerCase().includes(needle),
    )
    switch (sort) {
      case 'priceAsc':
        return [...matches].sort((a, b) => a.price - b.price)
      case 'priceDesc':
        return [...matches].sort((a, b) => b.price - a.price)
      case 'discount':
        return [...matches].sort((a, b) => discountOf(b) - discountOf(a))
      default:
        return matches
    }
  }, [products, category, query, sort])

  return (
    <div className="page catalog-page">
      <div className="page-title">
        <span className="kicker">{tr('catalogKicker')}</span>
        <h1>{tr('catalogTitle')}</h1>
        <p>{tr('catalogBody')}</p>
      </div>
      {!RESERVAS_ENABLED && (
        <div className="catalog-mode-note" role="note">
          <Info aria-hidden="true" />
          <p>{tr('catalogNotice')}</p>
        </div>
      )}
      <div className="catalog-tools">
        <label className="search">
          <Search />
          <input
            value={query}
            onChange={event => setQuery(event.target.value)}
            placeholder={tr('search')}
          />
        </label>
        <div className="categories">
          {CATEGORIES.map(([id, key]) => (
            <button
              key={id}
              className={category === id ? 'active' : ''}
              onClick={() => setCategory(id)}
            >
              {tr(key)}
            </button>
          ))}
        </div>
      </div>
      <div className="catalog-meta">
        <span>
          {filtered.length} {tr('productsWord')}
        </span>
        {RESERVAS_ENABLED && (
          <label className="sort-select">
            {tr('sortLabel')}
            <select value={sort} onChange={event => setSort(event.target.value as SortMode)}>
              {availableSorts.map(([id, key]) => (
                <option key={id} value={id}>
                  {tr(key)}
                </option>
              ))}
            </select>
          </label>
        )}
      </div>
      <div className="product-grid catalog-grid">
        {loading
          ? Array.from({ length: 8 }, (_, i) => <ProductCardSkeleton key={i} />)
          : filtered.map(product => <ProductCard key={product.id} product={product} />)}
      </div>
      {!loading && !filtered.length && (
        <div className="empty">
          <Search />
          <h2>{tr('noResults')}</h2>
        </div>
      )}
    </div>
  )
}
