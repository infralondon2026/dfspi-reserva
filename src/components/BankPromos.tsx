import { Landmark } from 'lucide-react'
import { useLocale } from '../context/AppContext'
import { bankPromos } from '../siteContent'
import Reveal from './Reveal'

export default function BankPromos() {
  const { locale, tr } = useLocale()
  if (!bankPromos.length) return null
  return (
    <section id="promos" className="section promos-section">
      <Reveal>
        <div className="section-head">
          <div>
            <span className="kicker">
              <Landmark size={14} /> {tr('promoKicker')}
            </span>
            <h2>{tr('promoTitle')}</h2>
            <p>{tr('promoBody')}</p>
          </div>
        </div>
      </Reveal>
      <div className="promo-grid">
        {bankPromos.map((promo, index) => (
          <Reveal key={promo.bank + index} delay={index * 90}>
            <article className="promo-card" style={{ borderTopColor: promo.color }}>
              <span className="promo-bank" style={{ color: promo.color }}>
                {promo.bank}
              </span>
              <h3>{promo.title[locale]}</h3>
              <p>{promo.detail[locale]}</p>
              <span className="promo-validity">
                {tr('promoValidityLabel')}: <b>{promo.validity[locale]}</b>
              </span>
            </article>
          </Reveal>
        ))}
      </div>
      <p className="promo-disclaimer">{tr('promoDisclaimer')}</p>
    </section>
  )
}
