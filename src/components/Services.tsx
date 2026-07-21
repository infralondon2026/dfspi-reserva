import { useLocale } from '../context/AppContext'
import { services } from '../siteContent'
import Reveal from './Reveal'

export default function Services() {
  const { locale, tr } = useLocale()
  if (!services.length) return null
  return (
    <section id="servicios" className="section services-section">
      <Reveal>
        <div className="section-head">
          <div>
            <span className="kicker light">{tr('servicesKicker')}</span>
            <h2>{tr('servicesTitle')}</h2>
            <p>{tr('servicesBody')}</p>
          </div>
        </div>
      </Reveal>
      <div className="services-grid">
        {services.map((service, index) => (
          <Reveal key={service.title[locale] + index} delay={index * 70}>
            <article className="service-card">
              <span className="service-icon">{service.icon}</span>
              <h3>{service.title[locale]}</h3>
              <p>{service.body[locale]}</p>
            </article>
          </Reveal>
        ))}
      </div>
    </section>
  )
}
