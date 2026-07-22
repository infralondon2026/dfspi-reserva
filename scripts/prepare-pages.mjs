import { copyFileSync, mkdirSync, readFileSync, writeFileSync } from 'node:fs'
import { dirname, join } from 'node:path'

const OUT = 'spa-dist'
const SITE = (process.env.PUBLIC_SITE_URL || 'https://infralondon2026.github.io/dfspi-reserva').replace(/\/$/, '')
const LANG = { es: 'es-AR', pt: 'pt-BR', en: 'en' }
const OG = { es: 'es_AR', pt: 'pt_BR', en: 'en_US' }
const productIds = ['ch-212', 'armani-way', 'amor-amor', 'moncler-sunrise', 'chivas-12', 'jw-black', 'jager', 'amarula', 'lindt-gold', 'airpods']

const content = {
  es: {
    title: 'Duty Free Shop Puerto Iguazú | Información oficial para tu visita',
    description: 'Horarios, ubicación, marcas, categorías, medios de pago, accesibilidad y preguntas frecuentes de Duty Free Shop Puerto Iguazú.',
    heading: 'Duty Free Shop Puerto Iguazú',
    intro: 'Información oficial para planificar tu visita a nuestra tienda en el Paso de Frontera de Puerto Iguazú, Misiones, Argentina.',
    visit: 'Abrimos todo el año: domingos a jueves de 12:00 a 20:00 y viernes y sábados de 12:00 a 21:00, hora argentina. Estamos en Ruta Nacional 12, km 1645,5.',
    shopping: 'Encontrá perfumería, bebidas, delicatessen, tecnología, moda, lentes, equipajes, juguetes y marcas internacionales. Las compras se realizan exclusivamente en la tienda física.',
    access: 'Para ingresar al predio debés registrar tu salida ante la aduana del país de procedencia y contar con la documentación requerida. Las franquicias dependen del país de destino.',
    services: 'La tienda ofrece estacionamiento gratuito, accesos adaptados, ascensores, rampas, sanitarios y probadores accesibles, cajas preferenciales, ingreso de perros guía y menú en Braille.',
    faqHeading: 'Preguntas frecuentes',
  },
  pt: {
    title: 'Duty Free Shop Puerto Iguazú | Informações oficiais para sua visita',
    description: 'Horários, localização, marcas, categorias, pagamentos, acessibilidade e perguntas frequentes do Duty Free Shop Puerto Iguazú.',
    heading: 'Duty Free Shop Puerto Iguazú',
    intro: 'Informações oficiais para planejar sua visita à nossa loja na passagem de fronteira de Puerto Iguazú, Misiones, Argentina.',
    visit: 'Abrimos o ano todo: de domingo a quinta, das 12h às 20h, e sextas e sábados, das 12h às 21h, horário argentino. Estamos na Ruta Nacional 12, km 1645,5.',
    shopping: 'Encontre perfumaria, bebidas, delicatessen, tecnologia, moda, óculos, bagagens, brinquedos e marcas internacionais. As compras são realizadas somente na loja física.',
    access: 'Para entrar no estabelecimento, registre sua saída na aduana do país de origem e tenha a documentação exigida. As franquias dependem do país de destino.',
    services: 'A loja oferece estacionamento gratuito, acessos adaptados, elevadores, rampas, banheiros e provadores acessíveis, caixas preferenciais, acesso para cães-guia e cardápio em Braille.',
    faqHeading: 'Perguntas frequentes',
  },
  en: {
    title: 'Duty Free Shop Puerto Iguazú | Official visitor information',
    description: 'Opening hours, location, brands, categories, payments, accessibility and frequently asked questions for Duty Free Shop Puerto Iguazú.',
    heading: 'Duty Free Shop Puerto Iguazú',
    intro: 'Official information to plan your visit to our store at the Puerto Iguazú border crossing in Misiones, Argentina.',
    visit: 'We are open year-round: Sunday through Thursday from 12:00 to 20:00, and Friday and Saturday from 12:00 to 21:00, Argentina time. Find us on National Route 12, km 1645.5.',
    shopping: 'Discover fragrances, beverages, delicatessen, technology, fashion, eyewear, luggage, toys and international brands. Purchases are made exclusively at the physical store.',
    access: 'To enter the premises, register your departure with the customs authority of your country of origin and carry the required documents. Allowances depend on the destination country.',
    services: 'The store offers free parking, accessible entrances, lifts, ramps, adapted restrooms and fitting rooms, priority checkouts, guide-dog access and a Braille menu.',
    faqHeading: 'Frequently asked questions',
  },
}

const faqs = {
  es: [
    ['¿Dónde está ubicado?', 'Ruta Nacional 12, km 1645,5, Paso de Frontera, Puerto Iguazú, Misiones.'],
    ['¿Cuáles son los horarios?', 'Domingos a jueves de 12:00 a 20:00; viernes y sábados de 12:00 a 21:00, hora argentina.'],
    ['¿Hacen envíos?', 'No realizamos envíos a domicilio.'],
    ['¿Qué medios de pago aceptan?', 'Visa, Mastercard, American Express, PIX, Visa Electron, Maestro y efectivo en USD, ARS o BRL.'],
    ['¿Realizan cambios?', 'Sí, por fallas de fabricación y con producto sin uso, embalaje y ticket originales.'],
    ['¿Ofrecen traslados?', 'No contamos con micros propios; consultá servicios de transporte local.'],
    ['¿Las promociones aplican a cualquier pago?', 'Sí, salvo condiciones específicas de una promoción o entidad bancaria.'],
    ['¿La tienda es accesible?', 'Sí, dispone de múltiples servicios e instalaciones adaptadas.'],
    ['¿Publican precios?', 'No se publican precios de productos en línea por política interna.'],
    ['¿Hay estacionamiento?', 'Sí, es gratuito y cuenta con espacios techados y al aire libre.'],
    ['¿Hay reservas online?', 'Por el momento no contamos con un sistema de reservas online.'],
    ['¿Existe límite de compra?', 'No mientras no se presuma fin comercial; las franquicias dependen del país de destino.'],
    ['¿Dónde consulto la cotización?', 'La cotización de USD a ARS y BRL se muestra en la entrada de la tienda.'],
  ],
  pt: [
    ['Onde fica a loja?', 'Ruta Nacional 12, km 1645,5, passagem de fronteira, Puerto Iguazú, Misiones.'],
    ['Quais são os horários?', 'Domingo a quinta, das 12h às 20h; sextas e sábados, das 12h às 21h, horário argentino.'],
    ['Fazem entregas?', 'Não realizamos entregas em domicílio.'],
    ['Quais pagamentos são aceitos?', 'Visa, Mastercard, American Express, PIX, Visa Electron, Maestro e dinheiro em USD, ARS ou BRL.'],
    ['É possível trocar produtos?', 'Sim, por defeito de fabricação e com produto sem uso, embalagem e comprovante originais.'],
    ['Oferecem transporte?', 'Não contamos com ônibus próprios; consulte serviços de transporte local.'],
    ['As promoções valem para qualquer pagamento?', 'Sim, salvo condições específicas da promoção ou do banco.'],
    ['A loja é acessível?', 'Sim, oferece diversos serviços e instalações adaptadas.'],
    ['Publicam preços?', 'Por política interna, os preços dos produtos não são publicados online.'],
    ['Há estacionamento?', 'Sim, é gratuito e possui áreas cobertas e ao ar livre.'],
    ['Há reservas online?', 'No momento, não contamos com um sistema de reservas online.'],
    ['Existe limite de compra?', 'Não, desde que não haja finalidade comercial; as franquias dependem do país de destino.'],
    ['Onde consulto a cotação?', 'As cotações de USD para ARS e BRL são exibidas na entrada da loja.'],
  ],
  en: [
    ['Where is the store?', 'National Route 12, km 1645.5, at the border crossing in Puerto Iguazú, Misiones.'],
    ['What are the opening hours?', 'Sunday through Thursday, 12:00–20:00; Friday and Saturday, 12:00–21:00, Argentina time.'],
    ['Do you offer delivery?', 'We do not offer home delivery.'],
    ['Which payment methods are accepted?', 'Visa, Mastercard, American Express, PIX, Visa Electron, Maestro and cash in USD, ARS or BRL.'],
    ['Can products be exchanged?', 'Yes, for manufacturing defects, with the product unused and in its original packaging with the receipt.'],
    ['Do you provide transportation?', 'We do not operate shuttle buses; please contact a local transport service.'],
    ['Do promotions apply to any payment method?', 'Yes, unless specific promotion or bank terms state otherwise.'],
    ['Is the store accessible?', 'Yes, it offers several adapted services and facilities.'],
    ['Are prices published online?', 'Company policy does not allow product prices to be published online.'],
    ['Is parking available?', 'Yes, free covered and outdoor parking is available.'],
    ['Is online reservation available?', 'Online product reservation is not currently available.'],
    ['Is there a purchase limit?', 'Not unless a commercial purpose is presumed; customs allowances depend on the destination country.'],
    ['Where can I check exchange rates?', 'USD-to-ARS and USD-to-BRL rates are displayed at the store entrance.'],
  ],
}

const escapeHtml = value => value.replace(/[&<>"']/g, character => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' })[character])
const routeSuffix = route => (route ? `/${route}/` : '/')
const localizedUrl = (locale, route = '') => `${SITE}/${locale}${routeSuffix(route)}`

function staticBody(locale, route) {
  const copy = content[locale]
  const faqHtml = faqs[locale].map(([question, answer]) => `<details><summary>${escapeHtml(question)}</summary><p>${escapeHtml(answer)}</p></details>`).join('')
  const routeHeading = route === 'catalogo'
    ? { es: 'Categorías y marcas', pt: 'Categorias e marcas', en: 'Categories and brands' }[locale]
    : route === 'legales'
      ? { es: 'Privacidad e información legal', pt: 'Privacidade e informações legais', en: 'Privacy and legal information' }[locale]
      : copy.heading
  return `<div id="root"><main class="seo-static"><h1>${escapeHtml(routeHeading)}</h1><p>${escapeHtml(copy.intro)}</p><h2>${locale === 'en' ? 'Plan your visit' : locale === 'pt' ? 'Planeje sua visita' : 'Planificá tu visita'}</h2><p>${escapeHtml(copy.visit)}</p><h2>${locale === 'en' ? 'Shopping and brands' : locale === 'pt' ? 'Compras e marcas' : 'Compras y marcas'}</h2><p>${escapeHtml(copy.shopping)}</p><h2>${locale === 'en' ? 'Customs and access' : locale === 'pt' ? 'Aduana e acesso' : 'Aduana y acceso'}</h2><p>${escapeHtml(copy.access)}</p><h2>${locale === 'en' ? 'Services and accessibility' : locale === 'pt' ? 'Serviços e acessibilidade' : 'Servicios y accesibilidad'}</h2><p>${escapeHtml(copy.services)}</p><h2>${escapeHtml(copy.faqHeading)}</h2>${faqHtml}<p><a href="mailto:info@dfspi.com">info@dfspi.com</a> · +54 3757 421050</p></main></div>`
}

function jsonLd(locale, route) {
  const graph = [
    { '@type': 'Organization', '@id': `${SITE}/#organization`, name: 'London Supply Group', url: 'https://londonsupplygroup.com/' },
    {
      '@type': ['Store', 'LocalBusiness'], '@id': `${SITE}/#store`, name: 'Duty Free Shop Puerto Iguazú',
      url: localizedUrl(locale), telephone: '+54 3757 421050', email: 'info@dfspi.com',
      parentOrganization: { '@id': `${SITE}/#organization` },
      address: { '@type': 'PostalAddress', streetAddress: 'Ruta Nacional 12, km 1645,5 - Paso de Frontera', addressLocality: 'Puerto Iguazú', addressRegion: 'Misiones', addressCountry: 'AR' },
      currenciesAccepted: 'USD, ARS, BRL',
      openingHoursSpecification: [
        { '@type': 'OpeningHoursSpecification', dayOfWeek: ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday'], opens: '12:00', closes: '20:00' },
        { '@type': 'OpeningHoursSpecification', dayOfWeek: ['Friday', 'Saturday'], opens: '12:00', closes: '21:00' },
      ],
    },
    { '@type': 'WebSite', '@id': `${SITE}/#website`, name: 'Duty Free Shop Puerto Iguazú', url: localizedUrl(locale), inLanguage: LANG[locale], publisher: { '@id': `${SITE}/#store` } },
  ]
  if (!route) graph.push({ '@type': 'FAQPage', '@id': `${localizedUrl(locale)}#faq`, inLanguage: LANG[locale], mainEntity: faqs[locale].map(([question, answer]) => ({ '@type': 'Question', name: question, acceptedAnswer: { '@type': 'Answer', text: answer } })) })
  return JSON.stringify({ '@context': 'https://schema.org', '@graph': graph }).replace(/</g, '\\u003c')
}

function render(template, locale, route = '') {
  const copy = content[locale]
  const title = route === 'catalogo'
    ? `${locale === 'en' ? 'Categories and brands' : locale === 'pt' ? 'Categorias e marcas' : 'Categorías y marcas'} | Duty Free Shop Puerto Iguazú`
    : route === 'legales'
      ? `${locale === 'en' ? 'Legal information' : locale === 'pt' ? 'Informações legais' : 'Información legal'} | Duty Free Shop Puerto Iguazú`
      : copy.title
  const canonical = localizedUrl(locale, route)
  const alternates = Object.keys(LANG).map(language => `<link id="alternate-${language}" rel="alternate" hreflang="${LANG[language]}" href="${localizedUrl(language, route)}" />`).join('\n    ')
  let html = template
    .replace(/<html lang="[^"]*">/, `<html lang="${LANG[locale]}">`)
    .replace(/<title>.*?<\/title>/s, `<title>${escapeHtml(title)}</title>`)
    .replace(/<meta name="description" content="[^"]*"\s*\/>/, `<meta name="description" content="${escapeHtml(copy.description)}" />`)
    .replace(/<link id="canonical"[^>]*>/, `<link id="canonical" rel="canonical" href="${canonical}" />`)
    .replace(/<link id="alternate-es"[\s\S]*?<link id="alternate-default"[^>]*>/, `${alternates}\n    <link id="alternate-default" rel="alternate" hreflang="x-default" href="${localizedUrl('es', route)}" />`)
    .replace(/<meta property="og:title" content="[^"]*"\s*\/>/, `<meta property="og:title" content="${escapeHtml(title)}" />`)
    .replace(/<meta property="og:description" content="[^"]*"\s*\/>/, `<meta property="og:description" content="${escapeHtml(copy.description)}" />`)
    .replace(/<meta property="og:url" content="[^"]*"\s*\/>/, `<meta property="og:url" content="${canonical}" />`)
    .replace(/<meta property="og:locale" content="[^"]*"\s*\/>/, `<meta property="og:locale" content="${OG[locale]}" />`)
    .replace(/<meta name="twitter:title" content="[^"]*"\s*\/>/, `<meta name="twitter:title" content="${escapeHtml(title)}" />`)
    .replace(/<meta name="twitter:description" content="[^"]*"\s*\/>/, `<meta name="twitter:description" content="${escapeHtml(copy.description)}" />`)
    .replace(/<script id="seo-jsonld" type="application\/ld\+json">[\s\S]*?<\/script>/, `<script id="seo-jsonld" type="application/ld+json">${jsonLd(locale, route)}</script>`)
    .replace('<div id="root"></div>', staticBody(locale, route))
  return html
}

function writeRoute(template, locale, route = '') {
  const file = join(OUT, locale, route, 'index.html')
  mkdirSync(dirname(file), { recursive: true })
  writeFileSync(file, render(template, locale, route), 'utf8')
}

const template = readFileSync(join(OUT, 'index.html'), 'utf8')
for (const locale of Object.keys(LANG)) {
  writeRoute(template, locale)
  writeRoute(template, locale, 'catalogo')
  writeRoute(template, locale, 'legales')
  for (const id of productIds) writeRoute(template, locale, `producto/${id}`)
}

writeFileSync(join(OUT, 'index.html'), render(template, 'es'), 'utf8')
mkdirSync(join(OUT, 'catalogo'), { recursive: true })
writeFileSync(join(OUT, 'catalogo', 'index.html'), render(template, 'es', 'catalogo'), 'utf8')
copyFileSync(join(OUT, 'index.html'), join(OUT, '404.html'))

const urls = []
for (const locale of Object.keys(LANG)) {
  urls.push(localizedUrl(locale), localizedUrl(locale, 'catalogo'), localizedUrl(locale, 'legales'))
  productIds.forEach(id => urls.push(localizedUrl(locale, `producto/${id}`)))
}
const sitemap = `<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n${urls.map(url => `  <url><loc>${url}</loc></url>`).join('\n')}\n</urlset>\n`
writeFileSync(join(OUT, 'sitemap.xml'), sitemap, 'utf8')
writeFileSync(join(OUT, 'robots.txt'), `User-agent: *\nAllow: /\nSitemap: ${SITE}/sitemap.xml\n`, 'utf8')
