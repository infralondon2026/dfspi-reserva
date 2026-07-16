import { useState } from 'react'
import { Link } from 'react-router-dom'
import { ArrowRight, Plus } from 'lucide-react'
import { useLocale } from '../context/AppContext'
import { faqs } from '../data'
import Reveal from './Reveal'

export default function FaqSection() {
  const { locale, tr } = useLocale()
  const [open, setOpen] = useState(faqs[0].id)
  return (
    <section id="faq" className="section faq-section">
      <Reveal>
        <div className="section-head">
          <div>
            <span className="kicker">FAQ</span>
            <h2>{tr('faqHeadTitle')}</h2>
          </div>
          <Link to="/mi-reserva" className="text-link">
            {tr('faqCta')} <ArrowRight />
          </Link>
        </div>
      </Reveal>
      <Reveal>
        <div className="faq-list">
          {faqs.map(faq => (
            <button
              key={faq.id}
              className={open === faq.id ? 'faq-item open' : 'faq-item'}
              onClick={() => setOpen(open === faq.id ? '' : faq.id)}
            >
              <span>{faq.question[locale]}</span>
              <Plus />
              {open === faq.id && <p>{faq.answer[locale]}</p>}
            </button>
          ))}
        </div>
      </Reveal>
    </section>
  )
}
