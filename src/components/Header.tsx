import { useState } from 'react'
import { Link, NavLink } from 'react-router-dom'
import { Clock3, Languages, Menu, ShoppingBag, Sparkles, X } from 'lucide-react'
import { logo } from '../assets'
import { RESERVAS_ENABLED } from '../config'
import { useCart, useLocale } from '../context/AppContext'
import { useScrolled, useScrollProgress } from '../hooks'
import type { Locale } from '../types'

export default function Header() {
  const { locale, setLocale, tr, path } = useLocale()
  const { count } = useCart()
  const [open, setOpen] = useState(false)
  const scrolled = useScrolled(24)
  const progress = useScrollProgress()
  const close = () => setOpen(false)

  return (
    <>
      <div className="announcement">
        <span>
          <Sparkles size={14} /> {tr('announcement')}
        </span>
        <span className="announcement-right">
          <Clock3 size={14} /> {tr('hours')}
        </span>
      </div>
      <header className={scrolled ? 'header scrolled' : 'header'}>
        <div className="scroll-progress" style={{ transform: `scaleX(${progress})` }} />
        <Link to={path('/')} className="brand">
          <img src={logo} alt="Duty Free Shop Puerto Iguazú" />
        </Link>
        <nav className={open ? 'nav open' : 'nav'}>
          <NavLink to={path('/')} onClick={close}>
            {tr('navHome')}
          </NavLink>
          <NavLink to={path('/catalogo')} onClick={close}>
            {tr('navCatalog')}
          </NavLink>
          <Link to={path('/#ofertas')} onClick={close}>
            {tr('navOffers')}
          </Link>
          <Link to={path('/#mapa')} onClick={close}>
            {tr('navStore')}
          </Link>
          <Link to={path('/#faq')} onClick={close}>
            {tr('navFaq')}
          </Link>
          {RESERVAS_ENABLED && (
            <NavLink to={path('/mi-reserva')} onClick={close}>
              {tr('navReservation')}
            </NavLink>
          )}
        </nav>
        <div className="header-actions">
          <div className="lang-switch" aria-label={tr('changeLanguage')} role="group">
            <Languages size={17} aria-hidden="true" />
            {(['es', 'pt', 'en'] as Locale[]).map(language => (
              <button
                key={language}
                type="button"
                className={locale === language ? 'active' : ''}
                onClick={() => setLocale(language)}
                aria-pressed={locale === language}
              >
                {language.toUpperCase()}
              </button>
            ))}
          </div>
          {RESERVAS_ENABLED && (
            <Link to={path('/seleccion')} className="cart-button" aria-label={tr('cart')}>
              <ShoppingBag size={20} />
              {count > 0 && <b>{count}</b>}
            </Link>
          )}
          <button className="menu" onClick={() => setOpen(!open)} aria-label={tr('menu')}>
            {open ? <X /> : <Menu />}
          </button>
        </div>
      </header>
    </>
  )
}
