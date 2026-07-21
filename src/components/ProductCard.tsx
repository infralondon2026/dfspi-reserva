import { useState } from 'react'
import { Link } from 'react-router-dom'
import { ArrowRight, Check, Heart, Plus } from 'lucide-react'
import { resolveImage } from '../assets'
import { RESERVAS_ENABLED } from '../config'
import { useCart, useLocale } from '../context/AppContext'
import type { Product } from '../types'

export default function ProductCard({ product }: { product: Product }) {
  const { locale, tr } = useLocale()
  const { add, favorites, toggleFavorite } = useCart()
  const [done, setDone] = useState(false)
  const favorite = favorites.includes(product.id)

  const handleAdd = () => {
    add(product.id)
    setDone(true)
    setTimeout(() => setDone(false), 1200)
  }

  return (
    <article className="product-card">
      <div className="product-image">
        <Link to={`/producto/${product.id}`}>
          <img src={resolveImage(product.image)} alt={`${product.brand} ${product.name}`} loading="lazy" />
        </Link>
        {product.originalPrice && (
          <span className="sale">-{Math.round((1 - product.price / product.originalPrice) * 100)}%</span>
        )}
        {RESERVAS_ENABLED && (
          <button
            className={favorite ? 'heart active' : 'heart'}
            onClick={() => toggleFavorite(product.id)}
            aria-label={tr('favorite')}
          >
            <Heart size={19} />
          </button>
        )}
      </div>
      <div className="product-info">
        <span className="brand-name">{product.brand}</span>
        <Link to={`/producto/${product.id}`}>
          <h3>{product.name}</h3>
        </Link>
        <p>{product.subtitle[locale]}</p>
        {RESERVAS_ENABLED && (
          <div className="availability">
            <i className={product.stock < 5 ? 'low' : ''} />
            {product.stock < 5 ? tr('lastUnits') : tr('available')}
          </div>
        )}
        <div className="product-bottom">
          <div className="price">
            <small>USD</small>
            <strong>{product.price}</strong>
            {product.originalPrice && <del>${product.originalPrice}</del>}
          </div>
          {RESERVAS_ENABLED ? (
            <button onClick={handleAdd} className={done ? 'add-button done' : 'add-button'}>
              {done ? <Check size={19} /> : <Plus size={19} />}
              <span>{done ? tr('added') : tr('add')}</span>
            </button>
          ) : (
            <Link to={`/producto/${product.id}`} className="add-button ghost-link" aria-label={tr('details')}>
              <span>{tr('details')}</span>
              <ArrowRight size={17} />
            </Link>
          )}
        </div>
      </div>
    </article>
  )
}

/** Placeholder card shown while the catalog loads. */
export function ProductCardSkeleton() {
  return (
    <article className="product-card skeleton-card" aria-hidden="true">
      <div className="product-image skeleton-box" />
      <div className="product-info">
        <span className="skeleton-line w40" />
        <span className="skeleton-line w80" />
        <span className="skeleton-line w60" />
      </div>
    </article>
  )
}
