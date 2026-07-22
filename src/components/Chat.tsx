import { useEffect, useMemo, useRef, useState } from 'react'
import { Bot, ChevronDown, List, Send, ShieldCheck, X } from 'lucide-react'
import { getChatReply, initialChatReply } from '../chatEngine'
import { useLocale } from '../context/AppContext'
import { faqs } from '../data'

interface Message {
  from: 'bot' | 'user'
  text: string
  suggestions?: string[]
}

export default function Chat() {
  const { locale, tr } = useLocale()
  const [open, setOpen] = useState(false)
  const [messages, setMessages] = useState<Message[]>(() => {
    const initial = initialChatReply(locale)
    return [{ from: 'bot', text: initial.text, suggestions: initial.suggestions }]
  })
  const [text, setText] = useState('')
  const [lastFaqId, setLastFaqId] = useState<string>()
  const [showTopics, setShowTopics] = useState(false)
  const bottomRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const initial = initialChatReply(locale)
    setMessages([{ from: 'bot', text: initial.text, suggestions: initial.suggestions }])
    setLastFaqId(undefined)
    setShowTopics(false)
  }, [locale])

  useEffect(() => {
    if (open) bottomRef.current?.scrollIntoView?.({ behavior: 'smooth', block: 'end' })
  }, [messages, open, showTopics])

  const latestSuggestions = useMemo(
    () => [...messages].reverse().find(message => message.from === 'bot')?.suggestions ?? [],
    [messages],
  )

  const reply = (value: string) => {
    const clean = value.trim()
    if (!clean) return
    const response = getChatReply(clean, locale, { lastFaqId })
    if (response.faqId) setLastFaqId(response.faqId)
    setMessages(current => [
      ...current,
      { from: 'user', text: clean },
      { from: 'bot', text: response.text, suggestions: response.suggestions },
    ])
    setText('')
    setShowTopics(false)
  }

  return (
    <>
      <button className="chat-launcher" onClick={() => setOpen(!open)} aria-label={tr('navFaq')}>
        {open ? <X /> : <Bot />}
        <span>{tr('chatNeedHelp')}</span>
      </button>
      {open && (
        <aside className="chat" aria-label={tr('chatAssistant')}>
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
          <div className="chat-body" aria-live="polite">
            {messages.map((message, index) => (
              <div key={index} className={`message ${message.from}`}>
                {message.text}
              </div>
            ))}

            {latestSuggestions.length > 0 && !showTopics && (
              <div className="suggestions">
                {latestSuggestions.map(question => (
                  <button key={question} onClick={() => reply(question)}>
                    {question}
                  </button>
                ))}
              </div>
            )}

            <button className="chat-topics-toggle" type="button" onClick={() => setShowTopics(current => !current)}>
              <List size={15} /> {tr('chatTopics')} <ChevronDown className={showTopics ? 'open' : ''} size={15} />
            </button>

            {showTopics && (
              <div className="chat-topics">
                {faqs.map(faq => (
                  <button key={faq.id} onClick={() => reply(faq.question[locale])}>
                    {faq.question[locale]}
                  </button>
                ))}
              </div>
            )}
            <div ref={bottomRef} />
          </div>
          <form
            className="chat-form"
            onSubmit={event => {
              event.preventDefault()
              reply(text)
            }}
          >
            <input
              value={text}
              onChange={event => setText(event.target.value)}
              placeholder={tr('ask')}
              aria-label={tr('ask')}
              autoComplete="off"
            />
            <button type="submit" aria-label={tr('send')} disabled={!text.trim()}>
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
