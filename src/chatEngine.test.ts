import { describe, expect, it } from 'vitest'
import { faqs } from './data'
import { getChatReply } from './chatEngine'
import type { Locale } from './types'

describe('controlled conversational FAQ engine', () => {
  it('handles greetings and conversational turns', () => {
    expect(getChatReply('hola', 'es').kind).toBe('greeting')
    expect(getChatReply('muchas gracias', 'es').kind).toBe('thanks')
    expect(getChatReply('chau', 'es').kind).toBe('goodbye')
  })

  it('answers a question even when it starts with a greeting', () => {
    const reply = getChatReply('hola, ¿a qué hora abren los viernes?', 'es')
    expect(reply.faqId).toBe('hours')
    expect(reply.text).toContain('viernes y sábados')
  })

  it('uses the previous FAQ as context for short follow-ups', () => {
    const first = getChatReply('¿Qué horario tienen?', 'es')
    const followUp = getChatReply('¿Y los sábados?', 'es', { lastFaqId: first.faqId })
    expect(first.faqId).toBe('hours')
    expect(followUp.faqId).toBe('hours')
  })

  it('recognizes natural phrasings for different approved intents', () => {
    expect(getChatReply('¿Puedo pagar con PIX?', 'es').faqId).toBe('payment')
    expect(getChatReply('¿Tienen baños para discapacitados?', 'es').faqId).toBe('accessibility')
    expect(getChatReply('Can I park there?', 'en').faqId).toBe('parking')
    expect(getChatReply('Vocês fazem entrega no Brasil?', 'pt').faqId).toBe('shipping')
  })

  it('never claims that online reservations are available', () => {
    const replies = [
      getChatReply('¿Puedo reservar por internet?', 'es'),
      getChatReply('Posso reservar online?', 'pt'),
      getChatReply('Can I reserve online?', 'en'),
    ]
    expect(replies.map(reply => reply.faqId)).toEqual([
      'online-reservations',
      'online-reservations',
      'online-reservations',
    ])
    expect(replies[0].text).toContain('no contamos')
    expect(replies[1].text).toContain('não contamos')
    expect(replies[2].text).toContain('not currently available')
  })

  it('matches every approved FAQ directly in every language', () => {
    for (const locale of ['es', 'pt', 'en'] as Locale[]) {
      for (const faq of faqs) {
        expect(getChatReply(faq.question[locale], locale).faqId).toBe(faq.id)
      }
    }
  })
})
