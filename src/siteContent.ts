import type { Locale } from './types'

export interface PaymentMethod {
  name: Record<Locale, string>
  icon: string
}

export const paymentMethods: PaymentMethod[] = [
  { name: { es: 'Visa', pt: 'Visa', en: 'Visa' }, icon: '💳' },
  { name: { es: 'Mastercard', pt: 'Mastercard', en: 'Mastercard' }, icon: '💳' },
  { name: { es: 'American Express', pt: 'American Express', en: 'American Express' }, icon: '💳' },
  { name: { es: 'Visa Electron / Maestro', pt: 'Visa Electron / Maestro', en: 'Visa Electron / Maestro' }, icon: '🏧' },
  { name: { es: 'PIX', pt: 'PIX', en: 'PIX' }, icon: '📲' },
  { name: { es: 'Efectivo USD / ARS / BRL', pt: 'Dinheiro USD / ARS / BRL', en: 'Cash USD / ARS / BRL' }, icon: '💵' },
]

export interface BankPromo {
  bank: string
  title: Record<Locale, string>
  detail: Record<Locale, string>
  validity: Record<Locale, string>
  color: string
}

// Se mantiene vacío hasta recibir promociones oficialmente aprobadas y vigentes.
export const bankPromos: BankPromo[] = []

export interface Service {
  icon: string
  title: Record<Locale, string>
  body: Record<Locale, string>
}

/** Servicios confirmados en la página oficial de preguntas frecuentes. */
export const services: Service[] = [
  {
    icon: '🅿️',
    title: { es: 'Estacionamiento gratuito', pt: 'Estacionamento gratuito', en: 'Free parking' },
    body: {
      es: '450 plazas techadas y otras 500 al aire libre, con 4 espacios reservados para personas con discapacidad.',
      pt: '450 vagas cobertas e outras 500 ao ar livre, com 4 espaços reservados para pessoas com deficiência.',
      en: '450 covered spaces and another 500 outdoors, including 4 spaces reserved for visitors with disabilities.',
    },
  },
  {
    icon: '♿',
    title: { es: 'Accesos adaptados', pt: 'Acessos adaptados', en: 'Accessible entrances' },
    body: {
      es: 'Ascensores, rampas mecánicas y sectores de circulación preparados para personas con movilidad reducida.',
      pt: 'Elevadores, rampas rolantes e áreas de circulação preparadas para pessoas com mobilidade reduzida.',
      en: 'Lifts, moving ramps and circulation areas designed for visitors with reduced mobility.',
    },
  },
  {
    icon: '🐕‍🦺',
    title: { es: 'Ingreso de perros guía', pt: 'Acesso para cães-guia', en: 'Guide dogs welcome' },
    body: {
      es: 'Está permitido el ingreso de perros guía que acompañen a personas con discapacidad visual.',
      pt: 'É permitida a entrada de cães-guia que acompanhem pessoas com deficiência visual.',
      en: 'Guide dogs accompanying visitors with visual disabilities are welcome.',
    },
  },
  {
    icon: '🚻',
    title: { es: 'Instalaciones accesibles', pt: 'Instalações acessíveis', en: 'Accessible facilities' },
    body: {
      es: 'Probadores y sanitarios adaptados, cajas preferenciales y mesas accesibles en el bar.',
      pt: 'Provadores e banheiros adaptados, caixas preferenciais e mesas acessíveis no bar.',
      en: 'Adapted fitting rooms and restrooms, priority checkouts and accessible tables in the bar.',
    },
  },
  {
    icon: '⠿',
    title: { es: 'Menú en Braille', pt: 'Cardápio em Braille', en: 'Braille menu' },
    body: {
      es: 'El bar dispone de un menú en Braille para personas con discapacidad visual.',
      pt: 'O bar oferece um cardápio em Braille para pessoas com deficiência visual.',
      en: 'The bar provides a Braille menu for visitors with visual disabilities.',
    },
  },
]

export interface NewsItem {
  date: Record<Locale, string>
  title: Record<Locale, string>
  body: Record<Locale, string>
  tag: Record<Locale, string>
}

// Se mantiene vacío para no publicar novedades ficticias o vencidas.
export const news: NewsItem[] = []

export interface SocialLink {
  name: string
  url: string
  icon: 'instagram' | 'facebook'
}

export const socials: SocialLink[] = [
  { name: 'Instagram', url: 'https://www.instagram.com/dutyfreeshoppuertoiguazu', icon: 'instagram' },
  { name: 'Facebook', url: 'https://www.facebook.com/dutyfreeshoppuertoiguazu', icon: 'facebook' },
]
