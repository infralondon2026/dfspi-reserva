import { useState, type FormEvent } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { ArrowRight, LockKeyhole, MapPin, PackageCheck, UserRound } from 'lucide-react'
import { storeAddress } from '../assets'
import { useCart, useLocale, useStoreData } from '../context/AppContext'
import { argentinaDatePlusDays } from '../lib/dates'
import CartPage from './CartPage'

export default function Checkout() {
  const navigate = useNavigate()
  const { locale, tr } = useLocale()
  const { store, reload } = useStoreData()
  const { cart, clear } = useCart()
  const [busy, setBusy] = useState(false)
  const [error, setError] = useState('')

  // Pickup window computed on the store's calendar (America/Argentina/Buenos_Aires).
  const minDate = argentinaDatePlusDays(1)
  const maxDate = argentinaDatePlusDays(7)

  if (!cart.length) return <CartPage />

  const submit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    setBusy(true)
    setError('')
    const data = new FormData(event.currentTarget)
    try {
      const reservation = await store.createReservation(
        {
          name: String(data.get('name')),
          email: String(data.get('email')),
          phone: String(data.get('phone')),
        },
        String(data.get('pickup')),
        cart,
        locale,
      )
      sessionStorage.setItem('dfspi-last-reservation', JSON.stringify(reservation))
      clear()
      void reload()
      navigate('/confirmacion')
    } catch {
      setError(tr('availabilityChanged'))
    } finally {
      setBusy(false)
    }
  }

  return (
    <div className="page checkout-page">
      <div className="checkout-intro">
        <span className="kicker">CHECKOUT</span>
        <h1>{tr('checkoutTitle')}</h1>
        <p>{tr('checkoutBody')}</p>
      </div>
      <form className="checkout-form" onSubmit={event => void submit(event)}>
        <div className="form-card">
          <h2>
            <UserRound /> {tr('yourData')}
          </h2>
          <div className="field-grid">
            <label>
              <span>{tr('name')}</span>
              <input name="name" required minLength={3} autoComplete="name" />
            </label>
            <label>
              <span>{tr('email')}</span>
              <input name="email" type="email" required autoComplete="email" />
            </label>
            <label>
              <span>{tr('phone')}</span>
              <input name="phone" type="tel" required minLength={7} autoComplete="tel" />
            </label>
            <label>
              <span>{tr('pickup')}</span>
              <input name="pickup" type="date" min={minDate} max={maxDate} defaultValue={minDate} required />
            </label>
          </div>
        </div>
        <div className="form-card">
          <h2>
            <PackageCheck /> {tr('storePickup')}
          </h2>
          <div className="pickup-box">
            <MapPin />
            <div>
              <b>Duty Free Shop Puerto Iguazú</b>
              <p>{storeAddress} · Paso de Frontera</p>
              <small>{tr('storeHoursLong')}</small>
            </div>
          </div>
        </div>
        <label className="terms">
          <input type="checkbox" required />
          <span>
            {tr('terms')} <Link to="/legales">{tr('readTerms')}</Link>
          </span>
        </label>
        {error && <p className="form-error">{error}</p>}
        <button className="button gold wide submit" disabled={busy}>
          {busy ? tr('confirming') : tr('confirm')} <ArrowRight />
        </button>
        <p className="secure">
          <LockKeyhole /> {tr('secure')}
        </p>
      </form>
    </div>
  )
}
