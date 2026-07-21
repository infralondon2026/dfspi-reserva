import { useLocale } from '../context/AppContext'
import { news } from '../siteContent'
import Reveal from './Reveal'

export default function StoreNews() {
  const { locale, tr } = useLocale()
  if (!news.length) return null
  return (
    <section id="novedades" className="section news-section">
      <Reveal>
        <div className="section-head">
          <div>
            <span className="kicker">{tr('newsKicker')}</span>
            <h2>{tr('newsTitle')}</h2>
            <p>{tr('newsBody')}</p>
          </div>
        </div>
      </Reveal>
      <div className="news-grid">
        {news.map((item, index) => (
          <Reveal key={item.title[locale] + index} delay={index * 90}>
            <article className="news-card">
              <div className="news-card-top">
                <span className="news-tag">{item.tag[locale]}</span>
                <span className="news-date">{item.date[locale]}</span>
              </div>
              <h3>{item.title[locale]}</h3>
              <p>{item.body[locale]}</p>
            </article>
          </Reveal>
        ))}
      </div>
    </section>
  )
}
