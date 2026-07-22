import { faqs } from './data'
import type { Faq, Locale } from './types'

export interface ChatContext {
  lastFaqId?: string
}

export interface ChatReply {
  text: string
  faqId?: string
  suggestions: string[]
  kind: 'greeting' | 'answer' | 'clarify' | 'thanks' | 'goodbye' | 'fallback'
}

const copy = {
  es: {
    greeting: '¡Hola! 👋 Soy el asistente de DFSPI. Puedo ayudarte con horarios, ubicación, medios de pago, accesibilidad, estacionamiento, aduana y más. ¿Qué querés saber?',
    help: 'Claro. Respondemos con información oficial sobre la tienda. Podés preguntarme por horarios, ubicación, pagos, cambios, transporte, accesibilidad, precios, estacionamiento, aduana o cotización.',
    thanks: '¡De nada! ¿Querés consultar algo más para preparar tu visita?',
    goodbye: '¡Hasta pronto! Que tengas un excelente viaje. Si te surge otra duda, escribime cuando quieras.',
    clarify: 'Encontré más de un tema relacionado. ¿Sobre cuál querés consultar?',
    fallback: 'No entendí del todo la consulta. Puedo ayudarte con la información oficial de la tienda. Elegí una opción o escribí la pregunta de otra manera.',
    followUp: '¿Querés saber algo más?',
  },
  pt: {
    greeting: 'Olá! 👋 Sou o assistente do DFSPI. Posso ajudar com horários, localização, pagamentos, acessibilidade, estacionamento, aduana e muito mais. O que você gostaria de saber?',
    help: 'Claro. Respondemos com informações oficiais sobre a loja. Pergunte sobre horários, localização, pagamentos, trocas, transporte, acessibilidade, preços, estacionamento, aduana ou cotação.',
    thanks: 'Por nada! Gostaria de consultar mais alguma coisa para preparar sua visita?',
    goodbye: 'Até logo! Tenha uma excelente viagem. Se surgir outra dúvida, escreva quando quiser.',
    clarify: 'Encontrei mais de um tema relacionado. Sobre qual deles você quer saber?',
    fallback: 'Não entendi totalmente a pergunta. Posso ajudar com as informações oficiais da loja. Escolha uma opção ou escreva a pergunta de outra forma.',
    followUp: 'Gostaria de saber mais alguma coisa?',
  },
  en: {
    greeting: 'Hello! 👋 I am the DFSPI assistant. I can help with opening hours, location, payments, accessibility, parking, customs and more. What would you like to know?',
    help: 'Of course. I answer using official store information. Ask about opening hours, location, payments, exchanges, transportation, accessibility, prices, parking, customs or exchange rates.',
    thanks: 'You are welcome! Would you like to check anything else before your visit?',
    goodbye: 'See you soon! Have a great trip. If another question comes up, just write to me again.',
    clarify: 'I found more than one related topic. Which one would you like to ask about?',
    fallback: 'I did not fully understand the question. I can help with official store information. Choose an option or try asking in a different way.',
    followUp: 'Would you like to know anything else?',
  },
} as const

const conversational = {
  es: {
    greetings: ['hola', 'buenas', 'buen dia', 'buenos dias', 'buenas tardes', 'buenas noches', 'hey', 'que tal'],
    thanks: ['gracias', 'muchas gracias', 'genial', 'perfecto', 'excelente', 'listo', 'entendido'],
    goodbye: ['chau', 'adios', 'hasta luego', 'nos vemos', 'bye'],
    help: ['ayuda', 'que podes hacer', 'en que me ayudas', 'opciones', 'informacion'],
    follow: ['y', 'tambien', 'ademas', 'entonces', 'sobre eso', 'ese tema', 'esa informacion'],
  },
  pt: {
    greetings: ['ola', 'oi', 'bom dia', 'boa tarde', 'boa noite', 'e ai', 'tudo bem'],
    thanks: ['obrigado', 'obrigada', 'muito obrigado', 'valeu', 'perfeito', 'excelente', 'entendi'],
    goodbye: ['tchau', 'ate logo', 'ate mais', 'nos vemos', 'bye'],
    help: ['ajuda', 'o que voce faz', 'como pode ajudar', 'opcoes', 'informacao'],
    follow: ['e', 'tambem', 'alem disso', 'entao', 'sobre isso', 'esse tema', 'essa informacao'],
  },
  en: {
    greetings: ['hello', 'hi', 'hey', 'good morning', 'good afternoon', 'good evening', 'how are you'],
    thanks: ['thanks', 'thank you', 'great', 'perfect', 'excellent', 'got it', 'understood'],
    goodbye: ['bye', 'goodbye', 'see you', 'see you later', 'take care'],
    help: ['help', 'what can you do', 'how can you help', 'options', 'information'],
    follow: ['and', 'also', 'what about', 'then', 'about that', 'that topic', 'that information'],
  },
} as const

/** Extra conversational vocabulary for each approved FAQ intent. */
const intentTerms: Record<string, Record<Locale, string[]>> = {
  location: {
    es: ['mapa', 'maps', 'ruta', 'kilometro', 'km', 'queda', 'como llegar'],
    pt: ['mapa', 'maps', 'rota', 'quilometro', 'km', 'fica', 'como chegar'],
    en: ['map', 'maps', 'route', 'kilometer', 'km', 'located', 'get there'],
  },
  hours: {
    es: ['viernes', 'sabado', 'domingo', 'lunes', 'hoy', 'feriado', 'fin de semana', 'hasta que hora'],
    pt: ['sexta', 'sabado', 'domingo', 'segunda', 'hoje', 'feriado', 'fim de semana', 'ate que horas'],
    en: ['friday', 'saturday', 'sunday', 'monday', 'today', 'holiday', 'weekend', 'what time'],
  },
  shipping: {
    es: ['mandar', 'correo', 'delivery', 'argentina', 'brasil'],
    pt: ['mandar', 'correio', 'delivery', 'argentina', 'brasil'],
    en: ['send', 'mail', 'delivery', 'argentina', 'brazil'],
  },
  payment: {
    es: ['visa', 'mastercard', 'amex', 'debito', 'dolares', 'pesos', 'reales'],
    pt: ['visa', 'mastercard', 'amex', 'debito', 'dolares', 'pesos', 'reais'],
    en: ['visa', 'mastercard', 'amex', 'debit', 'dollars', 'pesos', 'reais'],
  },
  exchanges: {
    es: ['devolver', 'falla', 'fallado', 'roto', 'garantia'],
    pt: ['devolver', 'falha', 'quebrado', 'garantia'],
    en: ['refund', 'fault', 'broken', 'warranty'],
  },
  transport: {
    es: ['taxi', 'remis', 'colectivo', 'bus', 'hotel'],
    pt: ['taxi', 'onibus', 'transfer', 'hotel'],
    en: ['taxi', 'bus', 'transfer', 'hotel'],
  },
  promotions: {
    es: ['oferta', 'cuotas', 'beneficio', 'bancaria'],
    pt: ['oferta', 'parcelas', 'beneficio', 'bancaria'],
    en: ['offer', 'installments', 'benefit', 'bank'],
  },
  accessibility: {
    es: ['ascensor', 'baño', 'sanitario', 'probador', 'perro', 'movilidad reducida', 'caja preferencial'],
    pt: ['elevador', 'banheiro', 'provador', 'cao', 'mobilidade reduzida', 'caixa preferencial'],
    en: ['lift', 'elevator', 'restroom', 'fitting room', 'dog', 'reduced mobility', 'priority checkout'],
  },
  prices: {
    es: ['cuesta', 'costar', 'catalogo de precios'],
    pt: ['custa', 'custar', 'catalogo de precos'],
    en: ['cost', 'how much', 'price list'],
  },
  parking: {
    es: ['estacionar', 'cochera', 'vehiculos'],
    pt: ['estacionar', 'garagem', 'veiculos'],
    en: ['park', 'garage', 'vehicles'],
  },
  'online-reservations': {
    es: ['separar', 'guardar producto', 'compra online', 'comprar por internet'],
    pt: ['separar', 'guardar produto', 'compra online', 'comprar pela internet'],
    en: ['hold product', 'online purchase', 'buy online'],
  },
  'purchase-limits': {
    es: ['cantidad', 'aduanero', 'comercial', 'pasaporte', 'documentos'],
    pt: ['quantidade', 'aduaneiro', 'comercial', 'passaporte', 'documentos'],
    en: ['quantity', 'allowance', 'commercial', 'passport', 'documents'],
  },
  'exchange-rate': {
    es: ['tipo de cambio', 'cambio del dia', 'conversion'],
    pt: ['taxa de cambio', 'cambio do dia', 'conversao'],
    en: ['currency conversion', 'rate today', 'conversion'],
  },
}

const stopWords: Record<Locale, Set<string>> = {
  es: new Set(['a', 'al', 'de', 'del', 'el', 'en', 'es', 'la', 'las', 'lo', 'los', 'me', 'para', 'por', 'que', 'se', 'un', 'una', 'y']),
  pt: new Set(['a', 'as', 'de', 'do', 'dos', 'e', 'em', 'o', 'os', 'para', 'por', 'que', 'se', 'um', 'uma']),
  en: new Set(['a', 'an', 'and', 'are', 'at', 'do', 'for', 'how', 'i', 'in', 'is', 'of', 'on', 'the', 'to', 'what', 'you']),
}

export function normalizeChatText(value: string) {
  return value
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .toLowerCase()
    .replace(/[^a-z0-9\s]/g, ' ')
    .replace(/\s+/g, ' ')
    .trim()
}

function tokens(value: string, locale: Locale) {
  return normalizeChatText(value)
    .split(' ')
    .filter(token => token.length > 1 && !stopWords[locale].has(token))
}

function matchesPhrase(value: string, phrases: readonly string[]) {
  return phrases.some(phrase => value === phrase || value.startsWith(`${phrase} `) || value.endsWith(` ${phrase}`))
}

function defaultSuggestions(locale: Locale) {
  const preferred = ['hours', 'location', 'payment', 'accessibility']
  return preferred.map(id => faqs.find(faq => faq.id === id)!.question[locale])
}

function relatedSuggestions(locale: Locale, currentId?: string) {
  const related: Record<string, string[]> = {
    location: ['hours', 'transport', 'parking'],
    hours: ['location', 'parking', 'transport'],
    shipping: ['online-reservations', 'location', 'transport'],
    payment: ['exchange-rate', 'promotions', 'prices'],
    exchanges: ['payment', 'prices', 'location'],
    transport: ['location', 'hours', 'parking'],
    promotions: ['payment', 'prices', 'exchange-rate'],
    accessibility: ['parking', 'location', 'hours'],
    prices: ['payment', 'exchange-rate', 'promotions'],
    parking: ['location', 'accessibility', 'hours'],
    'online-reservations': ['shipping', 'location', 'hours'],
    'purchase-limits': ['payment', 'exchange-rate', 'location'],
    'exchange-rate': ['payment', 'prices', 'purchase-limits'],
  }
  const ids = (currentId && related[currentId]) || ['hours', 'location', 'payment']
  return ids.map(id => faqs.find(faq => faq.id === id)!.question[locale])
}

function scoreFaq(faq: Faq, value: string, locale: Locale, context: ChatContext) {
  const queryTokens = tokens(value, locale)
  const questionTokens = new Set(tokens(faq.question[locale], locale))
  const answerTokens = new Set(tokens(faq.answer[locale], locale))
  const terms = [...faq.keywords[locale], ...(intentTerms[faq.id]?.[locale] ?? [])].map(normalizeChatText)
  let score = 0

  for (const term of terms) {
    if (!term) continue
    if (value.includes(term)) score += term.includes(' ') ? 10 : 7
  }
  for (const token of queryTokens) {
    if (questionTokens.has(token)) score += 3
    if (answerTokens.has(token)) score += 1
  }

  const isFollowUp = conversational[locale].follow.some(phrase => value.startsWith(`${phrase} `) || value === phrase)
  if (context.lastFaqId === faq.id && (isFollowUp || queryTokens.length <= 3)) score += 3
  return score
}

export function getChatReply(input: string, locale: Locale, context: ChatContext = {}): ChatReply {
  const value = normalizeChatText(input)
  const language = conversational[locale]
  const text = copy[locale]
  const wordCount = value.split(' ').length

  if (!value) return { text: text.help, suggestions: defaultSuggestions(locale), kind: 'greeting' }
  if (wordCount <= 4 && matchesPhrase(value, language.greetings)) return { text: text.greeting, suggestions: defaultSuggestions(locale), kind: 'greeting' }
  if (wordCount <= 5 && matchesPhrase(value, language.thanks)) return { text: text.thanks, suggestions: defaultSuggestions(locale), kind: 'thanks' }
  if (wordCount <= 5 && matchesPhrase(value, language.goodbye)) return { text: text.goodbye, suggestions: [], kind: 'goodbye' }
  if (matchesPhrase(value, language.help)) return { text: text.help, suggestions: defaultSuggestions(locale), kind: 'greeting' }

  const ranked = faqs
    .map(faq => ({ faq, score: scoreFaq(faq, value, locale, context) }))
    .filter(result => result.score > 0)
    .sort((a, b) => b.score - a.score)

  const best = ranked[0]
  if (!best || best.score < 4) {
    return { text: text.fallback, suggestions: defaultSuggestions(locale), kind: 'fallback' }
  }

  const second = ranked[1]
  if (second && best.score < 8 && best.score - second.score <= 1 && best.faq.id !== context.lastFaqId) {
    return {
      text: text.clarify,
      suggestions: [best.faq.question[locale], second.faq.question[locale]],
      kind: 'clarify',
    }
  }

  return {
    text: `${best.faq.answer[locale]}\n\n${text.followUp}`,
    faqId: best.faq.id,
    suggestions: relatedSuggestions(locale, best.faq.id),
    kind: 'answer',
  }
}

export function initialChatReply(locale: Locale): ChatReply {
  return {
    text: copy[locale].greeting,
    suggestions: defaultSuggestions(locale),
    kind: 'greeting',
  }
}
