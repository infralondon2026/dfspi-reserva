import { CreditCard } from 'lucide-react'
import { useLocale } from '../context/AppContext'
import { paymentMethods } from '../siteContent'
import Reveal from './Reveal'

export default function PaymentMethods() {
  const { tr } = useLocale()
  return (
    <section id="pagos" className="section payments-section">
      <Reveal>
        <div className="section-head">
          <div>
            <span className="kicker">
              <CreditCard size={14} /> {tr('payKicker')}
            </span>
            <h2>{tr('payTitle')}</h2>
            <p>{tr('payBody')}</p>
          </div>
        </div>
      </Reveal>
      <Reveal>
        <div className="payment-grid">
          {paymentMethods.map(method => (
            <div className="payment-chip" key={method.name}>
              <span className="payment-icon">{method.icon}</span>
              {method.name}
            </div>
          ))}
        </div>
      </Reveal>
    </section>
  )
}
