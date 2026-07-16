import { useEffect, useState } from 'react'
import { Bot, Send, ShieldCheck, X } from 'lucide-react'
import { useLocale } from '../context/AppContext'
import { faqs } from '../data'

interface Message {
  from: 'bot' | 'user'
  text: string
}

export default function Chat() {
  const { locale, tr } = useLocale()
  const [open, setOpen] = useState(false)
  const [messages, setMessages] = useState<Message[]>([{ from: 'bot', text: tr('chatGreeting') }])
  const [text, setText] = useState('')

  useEffect(() => {
    setMessages([{ from: 'bot', text: tr('chatGreeting') }])
  }, [tr])

  const reply = (value: string) => {
    if (!value.trim()) return
    const normalized = value
      .normalize('NFD')
      .replace(/[\u0300-\u036f]/g, '')
      .toLowerCase()
    const found = faqs.find(faq => faq.keywords[locale].some(k => normalized.includes(k)))
    setMessages(current => [
      ...current,
      { from: 'user', text: value },
      { from: 'bot', text: found ? found.answer[locale] : tr('fallback') },
    ])
    setText('')
  }

  return (
    <>
      <button className="chat-launcher" onClick={() => setOpen(!open)} aria-label={tr('navFaq')}>
        {open ? <X /> : <Bot />}
        <span>{tr('chatNeedHelp')}</span>
      </button>
      {open && (
        <aside className="chat">
          <div className="chat-head">
            <div>
              <Bot />
              <span>
                <b>{tr('chatAssistant')}</b>
                <small>
                  <i /> {tr('chatOnline')}
                </small>
              </span>
            </div>
            <button onClick={() => setOpen(false)} aria-label={tr('menu')}>
              <X />
            </button>
          </div>
          <div className="chat-body">
            {messages.map((message, index) => (
              <div key={index} className={`message ${message.from}`}>
                {message.text}
              </div>
            ))}
            {messages.length < 3 && (
              <div className="suggestions">
                {faqs.slice(0, 3).map(faq => (
                  <button key={faq.id} onClick={() => reply(faq.question[locale])}>
                    {faq.question[locale]}
                  </button>
                ))}
              </div>
            )}
          </div>
          <form
            className="chat-form"
            onSubmit={event => {
              event.preventDefault()
              reply(text)
            }}
          >
            <input value={text} onChange={event => setText(event.target.value)} placeholder={tr('ask')} />
            <button aria-label={tr('send')}>
              <Send />
            </button>
          </form>
          <div className="chat-safe">
            <ShieldCheck /> {tr('chatVerified')}
          </div>
        </aside>
      )}
    </>
  )
}
