import { describe, expect, it } from 'vitest'
import { RESERVAS_ENABLED } from './config'
import { faqs } from './data'
import { ui } from './i18n'
import type { Locale } from './types'

const locales: Locale[] = ['es', 'pt', 'en']

describe('public informational content', () => {
  it('publishes every official FAQ in all three languages', () => {
    expect(faqs).toHaveLength(13)
    for (const faq of faqs) {
      for (const locale of locales) {
        expect(faq.question[locale]).toBeTruthy()
        expect(faq.answer[locale]).toBeTruthy()
        expect(faq.keywords[locale].length).toBeGreaterThan(0)
      }
    }
  })

  it('states that online reservations are not available', () => {
    const reservationFaq = faqs.find(faq => faq.id === 'online-reservations')
    expect(reservationFaq?.answer.es).toContain('no contamos')
    expect(reservationFaq?.answer.pt).toContain('não contamos')
    expect(reservationFaq?.answer.en).toContain('not currently available')
    expect(RESERVAS_ENABLED).toBe(false)
  })

  it('has a complete public UI dictionary for English', () => {
    expect(Object.keys(ui.en).sort()).toEqual(Object.keys(ui.es).sort())
    expect(ui.en.heroTitle).toMatch(/duty-free/i)
    expect(ui.en.visitorAccessTitle).toBe('Access and documents')
  })
})
