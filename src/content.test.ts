import { describe, expect, it } from 'vitest'
import { RESERVAS_ENABLED } from './config'
import { faqs } from './data'
import { ui } from './i18n'
import { socials } from './siteContent'
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
    expect(ui.es.catalogKicker).toBe('CATÁLOGO INFORMATIVO')
    expect(ui.es.catalogNotice).toContain('No permite compras ni reservas online')
  })

  it('has a complete public UI dictionary for English', () => {
    expect(Object.keys(ui.en).sort()).toEqual(Object.keys(ui.es).sort())
    expect(ui.en.heroTitle).toMatch(/duty-free/i)
    expect(ui.en.visitorAccessTitle).toBe('Access and documents')
  })

  it('links to the official DFSPI social accounts', () => {
    expect(socials).toEqual([
      { name: 'Instagram', url: 'https://www.instagram.com/dfspuertoiguazu/?hl=es', icon: 'instagram' },
      { name: 'Facebook', url: 'https://www.facebook.com/dfspuertoiguazu/?locale=es_LA', icon: 'facebook' },
    ])
  })
})
