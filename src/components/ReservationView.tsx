import { Clock3 } from 'lucide-react'
import { resolveImage } from '../assets'
import { useLocale, useStoreData } from '../context/AppContext'
import type { Reservation, ReservationStatus } from '../types'

export function StatusBadge({ status }: { status: ReservationStatus }) {
  return <span className={`status ${status}`}>{status.replaceAll('_', ' ')}</span>
}

export default function ReservationView({ reservation }: { reservation: Reservation }) {
  const { locale, tr } = useLocale()
  const { products } = useStoreData()
  return (
    <div className="reservation-view">
      <div>
        <span>
          {tr('reservationWord')} <b>{reservation.code}</b>
        </span>
        <StatusBadge status={reservation.status} />
      </div>
      <p>
        <Clock3 size={18} />{' '}
        {new Date(reservation.pickupDate + 'T12:00:00').toLocaleDateString(
          locale === 'es' ? 'es-AR' : 'pt-BR',
          { dateStyle: 'long' },
        )}
      </p>
      {reservation.items.map(item => {
        const product = products.find(p => p.id === item.productId)
        if (!product) return null
        return (
          <div className="mini-item" key={item.productId}>
            <img src={resolveImage(product.image)} alt={product.name} />
            <span>
              {product.brand}
              <b>{product.name}</b>
            </span>
            <strong>
              {item.quantity} × USD {product.price}
            </strong>
          </div>
        )
      })}
      <div className="mini-total">
        <span>Total</span>
        <b>USD {reservation.total}</b>
      </div>
    </div>
  )
}
