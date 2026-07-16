import { useState } from 'react'
import { Link, NavLink } from 'react-router-dom'
import { Clock3, Languages, Menu, ShoppingBag, Sparkles, X } from 'lucide-react'
import { logo } from '../assets'
import { useCart, useLocale } from '../context/AppContext'
import { useScrolled, useScrollProgress } from '../hooks'

export default function Header() {
  const { locale, setLocale, tr } = useLocale()
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
        <Link to="/" className="brand">
          <img src={logo} alt="Duty Free Shop Puerto Iguazú" />
        </Link>
        <nav className={open ? 'nav open' : 'nav'}>
          <NavLink to="/" onClick={close}>
            {tr('navHome')}
          </NavLink>
          <NavLink to="/catalogo" onClick={close}>
            {tr('navCatalog')}
          </NavLink>
          <Link to="/#como" onClick={close}>
            {tr('navHow')}
          </Link>
          <Link to="/#faq" onClick={close}>
            {tr('navFaq')}
          </Link>
          <NavLink to="/mi-reserva" onClick={close}>
            {tr('navReservation')}
          </NavLink>
        </nav>
        <div className="header-actions">
          <button
            className="lang"
            onClick={() => setLocale(locale === 'es' ? 'pt' : 'es')}
            aria-label={tr('changeLanguage')}
          >
            <Languages size={18} />
            <span>{locale.toUpperCase()}</span>
          </button>
          <Link to="/seleccion" className="cart-button" aria-label={tr('cart')}>
            <ShoppingBag size={20} />
            {count > 0 && <b>{count}</b>}
          </Link>
          <button className="menu" onClick={() => setOpen(!open)} aria-label={tr('menu')}>
            {open ? <X /> : <Menu />}
          </button>
        </div>
      </header>
    </>
  )
}
