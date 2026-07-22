import { Link } from 'react-router-dom'
import { ArrowRight, Minus, Plus, ShieldCheck, ShoppingBag, Trash2 } from 'lucide-react'
import { resolveImage } from '../assets'
import { useCart, useLocale, useStoreData } from '../context/AppContext'

export default function CartPage() {
  const { locale, tr, path } = useLocale()
  const { products } = useStoreData()
  const { cart, update } = useCart()

  const items = cart
    .map(item => ({ ...item, product: products.find(p => p.id === item.productId)! }))
    .filter(item => item.product)
  const total = items.reduce((sum, item) => sum + item.product.price * item.quantity, 0)

  if (!items.length) {
    return (
      <div className="page empty">
        <ShoppingBag />
        <h1>{tr('emptyCart')}</h1>
        <p>{tr('emptyCartBody')}</p>
        <Link to={path('/catalogo')} className="button navy">
          {tr('continue')}
        </Link>
      </div>
    )
  }

  return (
    <div className="page cart-page">
      <div className="page-title left">
        <span className="kicker">{tr('cartKicker')}</span>
        <h1>{tr('cart')}</h1>
      </div>
      <div className="cart-layout">
        <div className="cart-items">
          {items.map(item => (
            <div className="cart-row" key={item.productId}>
              <img src={resolveImage(item.product.image)} alt={item.product.name} />
              <div className="cart-product">
                <small>{item.product.brand}</small>
                <h3>{item.product.name}</h3>
                <p>{item.product.subtitle[locale]}</p>
                <button onClick={() => update(item.productId, 0)}>
                  <Trash2 /> {tr('remove')}
                </button>
              </div>
              <div className="cart-qty">
                <button onClick={() => update(item.productId, item.quantity - 1)} aria-label="-">
                  <Minus />
                </button>
                <span>{item.quantity}</span>
                <button onClick={() => update(item.productId, item.quantity + 1)} aria-label="+">
                  <Plus />
                </button>
              </div>
              <strong>USD {item.product.price * item.quantity}</strong>
            </div>
          ))}
        </div>
        <aside className="summary-card">
          <h2>{tr('summary')}</h2>
          <div>
            <span>
              {items.length} {tr('items')}
            </span>
            <span>USD {total}</span>
          </div>
          <hr />
          <div className="summary-total">
            <span>{tr('subtotal')}</span>
            <strong>USD {total}</strong>
          </div>
          <p>
            <ShieldCheck /> {tr('payStore')}
          </p>
          <Link to={path('/checkout')} className="button gold wide">
            {tr('checkout')} <ArrowRight />
          </Link>
        </aside>
      </div>
    </div>
  )
}
