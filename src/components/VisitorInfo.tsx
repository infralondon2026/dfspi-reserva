import { FileCheck2, MapPinned, Scale } from 'lucide-react'
import { useLocale } from '../context/AppContext'
import Reveal from './Reveal'

export default function VisitorInfo() {
  const { tr } = useLocale()
  const cards = [
    { icon: <FileCheck2 />, title: tr('visitorAccessTitle'), body: tr('visitorAccessBody') },
    { icon: <Scale />, title: tr('visitorCustomsTitle'), body: tr('visitorCustomsBody') },
    { icon: <MapPinned />, title: tr('visitorTransportTitle'), body: tr('visitorTransportBody') },
  ]

  return (
    <section id="visita" className="section visitor-info-section">
      <Reveal>
        <div className="section-head">
          <div>
            <span className="kicker">{tr('visitorKicker')}</span>
            <h2>{tr('visitorTitle')}</h2>
            <p>{tr('visitorBody')}</p>
          </div>
        </div>
      </Reveal>
      <div className="services-grid">
        {cards.map((card, index) => (
          <Reveal key={card.title} delay={index * 80}>
            <article className="service-card">
              <span className="service-icon">{card.icon}</span>
              <h3>{card.title}</h3>
              <p>{card.body}</p>
            </article>
          </Reveal>
        ))}
      </div>
    </section>
  )
}
