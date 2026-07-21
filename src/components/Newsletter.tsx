import { useState, type FormEvent } from 'react'
import { Check, Mail, Send } from 'lucide-react'
import { useLocale, useStoreData } from '../context/AppContext'
import Reveal from './Reveal'

type Status = 'idle' | 'busy' | 'ok' | 'error'

export default function Newsletter() {
  const { locale, tr } = useLocale()
  const { store } = useStoreData()
  const [status, setStatus] = useState<Status>('idle')

  const submit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    // Capture the form now: event.currentTarget is null after the await.
    const form = event.currentTarget
    const email = String(new FormData(form).get('email') || '').trim()
    if (!email) return
    setStatus('busy')
    try {
      await store.subscribeNewsletter(email, locale)
      form.reset()
      setStatus('ok')
    } catch {
      setStatus('error')
    }
  }

  return (
    <section id="newsletter" className="newsletter-band">
      <Reveal className="newsletter-inner">
        <span className="kicker light">{tr('newsletterKicker')}</span>
        <h2>{tr('newsletterTitle')}</h2>
        <p>{tr('newsletterBody')}</p>
        {status === 'ok' ? (
          <p className="newsletter-ok">
            <Check size={20} /> {tr('newsletterOk')}
          </p>
        ) : (
          <form className="newsletter-form" onSubmit={event => void submit(event)}>
            <label className="newsletter-field">
              <Mail size={18} />
              <input
                name="email"
                type="email"
                required
                placeholder={tr('newsletterPlaceholder')}
                aria-label={tr('newsletterPlaceholder')}
              />
            </label>
            <button className="button gold" disabled={status === 'busy'}>
              {tr('newsletterButton')} <Send size={17} />
            </button>
          </form>
        )}
        {status === 'error' && <p className="newsletter-error">{tr('newsletterError')}</p>}
        <small className="newsletter-privacy">{tr('newsletterPrivacy')}</small>
      </Reveal>
    </section>
  )
}
