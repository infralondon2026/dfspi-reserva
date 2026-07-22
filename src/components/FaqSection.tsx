import { useState } from 'react'
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
          <a href="mailto:info@dfspi.com" className="text-link">
            {tr('faqCta')} <ArrowRight />
          </a>
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
