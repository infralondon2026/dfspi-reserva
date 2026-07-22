import { Link } from 'react-router-dom'
import { QRCodeSVG } from 'qrcode.react'
import { Check, Send, ShieldCheck } from 'lucide-react'
import { logo } from '../assets'
import { useLocale, useStoreData } from '../context/AppContext'
import type { Reservation } from '../types'
import NotFound from './NotFound'

export default function Confirmation() {
  const { locale, tr, path } = useLocale()
  const { store } = useStoreData()

  let reservation: Reservation | null = null
  try {
    reservation = JSON.parse(sessionStorage.getItem('dfspi-last-reservation') || 'null')
  } catch {
    reservation = null
  }
  if (!reservation) return <NotFound />

  return (
    <div className="page confirmation">
      <div className="success-icon">
        <Check />
      </div>
      <span className="kicker">{tr('confirmKicker')}</span>
      <h1>{tr('success')}</h1>
      <p>{tr('successBody')}</p>
      <div className="ticket">
        <div className="ticket-logo">
          <img src={logo} alt="DFSPI" />
        </div>
        <div className="qr">
          {/* The QR carries only the reservation code — no personal data. */}
          <QRCodeSVG value={`DFSPI:${reservation.code}`} size={148} />
        </div>
        <small>{tr('code')}</small>
        <strong className="reservation-code">{reservation.code}</strong>
        <div className="ticket-info">
          <span>
            {tr('pickup')}
            <b>
              {new Date(reservation.pickupDate + 'T12:00:00').toLocaleDateString(
                locale === 'es' ? 'es-AR' : locale === 'pt' ? 'pt-BR' : 'en-US',
                { weekday: 'long', day: 'numeric', month: 'long' },
              )}
            </b>
          </span>
          <span>
            {tr('subtotal')}
            <b>USD {reservation.total}</b>
          </span>
        </div>
      </div>
      {store.mode === 'demo' ? (
        <p className="email-note">
          <ShieldCheck /> {tr('demoNoEmail')}
        </p>
      ) : (
        <p className="email-note">
          <Send /> {tr('emailSent')} <b>{reservation.customer.email}</b>
        </p>
      )}
      <div className="confirmation-actions">
        <Link className="button navy" to={path('/')}>
          {tr('backHome')}
        </Link>
        <Link className="button outline" to={path('/mi-reserva')}>
          {tr('navReservation')}
        </Link>
      </div>
    </div>
  )
}
