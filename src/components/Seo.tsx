import { useEffect } from 'react'
import { useLocation } from 'react-router-dom'
import { faqs, products } from '../data'
import { useLocale } from '../context/AppContext'
import type { Locale } from '../types'

const SITE_URL = (import.meta.env.VITE_PUBLIC_SITE_URL || 'https://infralondon2026.github.io/dfspi-reserva').replace(/\/$/, '')
const LANG_TAG: Record<Locale, string> = { es: 'es-AR', pt: 'pt-BR', en: 'en' }
const OG_LOCALE: Record<Locale, string> = { es: 'es_AR', pt: 'pt_BR', en: 'en_US' }

const meta = {
  es: {
    title: 'Duty Free Shop Puerto Iguazú | Información oficial para tu visita',
    description: 'Horarios, ubicación, marcas, categorías, medios de pago, accesibilidad y preguntas frecuentes de Duty Free Shop Puerto Iguazú.',
    catalog: 'Categorías y marcas | Duty Free Shop Puerto Iguazú',
    legal: 'Privacidad e información legal | Duty Free Shop Puerto Iguazú',
  },
  pt: {
    title: 'Duty Free Shop Puerto Iguazú | Informações oficiais para sua visita',
    description: 'Horários, localização, marcas, categorias, pagamentos, acessibilidade e perguntas frequentes do Duty Free Shop Puerto Iguazú.',
    catalog: 'Categorias e marcas | Duty Free Shop Puerto Iguazú',
    legal: 'Privacidade e informações legais | Duty Free Shop Puerto Iguazú',
  },
  en: {
    title: 'Duty Free Shop Puerto Iguazú | Official visitor information',
    description: 'Opening hours, location, brands, categories, payments, accessibility and frequently asked questions for Duty Free Shop Puerto Iguazú.',
    catalog: 'Categories and brands | Duty Free Shop Puerto Iguazú',
    legal: 'Privacy and legal information | Duty Free Shop Puerto Iguazú',
  },
} as const

function upsertMeta(selector: string, attributes: Record<string, string>) {
  let element = document.head.querySelector<HTMLMetaElement>(selector)
  if (!element) {
    element = document.createElement('meta')
    document.head.appendChild(element)
  }
  Object.entries(attributes).forEach(([key, value]) => element!.setAttribute(key, value))
}

function upsertLink(id: string, rel: string, href: string, hreflang?: string) {
  let element = document.head.querySelector<HTMLLinkElement>(`#${id}`)
  if (!element) {
    element = document.createElement('link')
    element.id = id
    document.head.appendChild(element)
  }
  element.rel = rel
  element.href = href
  if (hreflang) element.hreflang = hreflang
}

export default function Seo() {
  const { locale } = useLocale()
  const location = useLocation()

  useEffect(() => {
    const copy = meta[locale]
    const route = location.pathname.split('/').filter(Boolean).slice(1)
    const product = route[0] === 'producto' ? products.find(item => item.id === route[1]) : undefined
    const title = product
      ? `${product.brand} ${product.name} | Duty Free Shop Puerto Iguazú`
      : route[0] === 'catalogo'
        ? copy.catalog
        : route[0] === 'legales'
          ? copy.legal
          : copy.title
    const description = product ? product.description[locale] : copy.description
    const canonicalPath = location.pathname.endsWith('/') || route.length ? location.pathname : `${location.pathname}/`
    const canonical = `${SITE_URL}${canonicalPath}`

    document.documentElement.lang = LANG_TAG[locale]
    document.title = title
    upsertMeta('meta[name="description"]', { name: 'description', content: description })
    upsertMeta('meta[name="robots"]', { name: 'robots', content: 'index, follow, max-image-preview:large' })
    upsertMeta('meta[property="og:title"]', { property: 'og:title', content: title })
    upsertMeta('meta[property="og:description"]', { property: 'og:description', content: description })
    upsertMeta('meta[property="og:url"]', { property: 'og:url', content: canonical })
    upsertMeta('meta[property="og:locale"]', { property: 'og:locale', content: OG_LOCALE[locale] })
    upsertMeta('meta[name="twitter:title"]', { name: 'twitter:title', content: title })
    upsertMeta('meta[name="twitter:description"]', { name: 'twitter:description', content: description })
    upsertLink('canonical', 'canonical', canonical)

    const suffix = `/${route.join('/')}${route.length ? '' : '/'}`
    ;(['es', 'pt', 'en'] as Locale[]).forEach(language => {
      upsertLink(`alternate-${language}`, 'alternate', `${SITE_URL}/${language}${suffix}`, LANG_TAG[language])
    })
    upsertLink('alternate-default', 'alternate', `${SITE_URL}/es${suffix}`, 'x-default')

    const graph: Record<string, unknown>[] = [
      {
        '@type': 'Organization',
        '@id': `${SITE_URL}/#organization`,
        name: 'London Supply Group',
        url: 'https://londonsupplygroup.com/',
      },
      {
        '@type': ['Store', 'LocalBusiness'],
        '@id': `${SITE_URL}/#store`,
        name: 'Duty Free Shop Puerto Iguazú',
        url: `${SITE_URL}/${locale}/`,
        image: `${SITE_URL}/img/logo.png`,
        telephone: '+54 3757 421050',
        email: 'info@dfspi.com',
        parentOrganization: { '@id': `${SITE_URL}/#organization` },
        address: {
          '@type': 'PostalAddress',
          streetAddress: 'Ruta Nacional 12, km 1645,5 - Paso de Frontera',
          addressLocality: 'Puerto Iguazú',
          addressRegion: 'Misiones',
          addressCountry: 'AR',
        },
        currenciesAccepted: 'USD, ARS, BRL',
        paymentAccepted: 'Visa, Mastercard, American Express, Visa Electron, Maestro, PIX, Cash',
        openingHoursSpecification: [
          { '@type': 'OpeningHoursSpecification', dayOfWeek: ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday'], opens: '12:00', closes: '20:00' },
          { '@type': 'OpeningHoursSpecification', dayOfWeek: ['Friday', 'Saturday'], opens: '12:00', closes: '21:00' },
        ],
        sameAs: [
          'https://www.instagram.com/dfspuertoiguazu/?hl=es',
          'https://www.facebook.com/dfspuertoiguazu/?locale=es_LA',
        ],
      },
      {
        '@type': 'WebSite',
        '@id': `${SITE_URL}/#website`,
        name: 'Duty Free Shop Puerto Iguazú',
        url: `${SITE_URL}/${locale}/`,
        inLanguage: LANG_TAG[locale],
        publisher: { '@id': `${SITE_URL}/#store` },
      },
    ]

    if (route.length === 0) {
      graph.push({
        '@type': 'FAQPage',
        '@id': `${SITE_URL}/${locale}/#faq`,
        inLanguage: LANG_TAG[locale],
        mainEntity: faqs.map(faq => ({
          '@type': 'Question',
          name: faq.question[locale],
          acceptedAnswer: { '@type': 'Answer', text: faq.answer[locale] },
        })),
      })
    }

    let script = document.head.querySelector<HTMLScriptElement>('#seo-jsonld')
    if (!script) {
      script = document.createElement('script')
      script.id = 'seo-jsonld'
      script.type = 'application/ld+json'
      document.head.appendChild(script)
    }
    script.textContent = JSON.stringify({ '@context': 'https://schema.org', '@graph': graph })
  }, [locale, location.pathname])

  return null
}
