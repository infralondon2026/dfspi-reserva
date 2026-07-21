import type { Locale } from './types'

/**
 * Contenido informativo del sitio (secciones institucionales).
 *
 * PARA REVISIÓN DE MARKETING: promociones bancarias, novedades, servicios y
 * redes sociales son contenido de ejemplo editable. Reemplazar por la
 * información oficial y vigente antes de publicar. Las promos bancarias son
 * afirmaciones comerciales: deben reflejar acuerdos reales y sus vigencias.
 */

export interface PaymentMethod {
  name: string
  icon: string
}

export const paymentMethods: PaymentMethod[] = [
  { name: 'Visa', icon: '💳' },
  { name: 'Mastercard', icon: '💳' },
  { name: 'American Express', icon: '💳' },
  { name: 'Débito', icon: '🏧' },
  { name: 'PIX', icon: '📲' },
  { name: 'Efectivo USD / ARS / BRL', icon: '💵' },
]

export interface BankPromo {
  bank: string
  title: Record<Locale, string>
  detail: Record<Locale, string>
  validity: Record<Locale, string>
  color: string
}

// PLACEHOLDER — reemplazar por las promociones bancarias vigentes reales.
export const bankPromos: BankPromo[] = [
  {
    bank: 'Banco Macro',
    title: { es: '3 cuotas sin interés', pt: '3 parcelas sem juros' },
    detail: {
      es: 'En compras con tarjeta de crédito Visa y Mastercard.',
      pt: 'Em compras com cartão de crédito Visa e Mastercard.',
    },
    validity: { es: 'Todos los días', pt: 'Todos os dias' },
    color: '#0B6EB6',
  },
  {
    bank: 'Banco Nación',
    title: { es: '15% de descuento', pt: '15% de desconto' },
    detail: {
      es: 'Los martes y jueves abonando con MODO.',
      pt: 'Às terças e quintas pagando com MODO.',
    },
    validity: { es: 'Martes y jueves', pt: 'Terças e quintas' },
    color: '#00695C',
  },
  {
    bank: 'Banco Galicia',
    title: { es: '6 cuotas sin interés', pt: '6 parcelas sem juros' },
    detail: {
      es: 'En perfumería y tecnología seleccionadas.',
      pt: 'Em perfumaria e tecnologia selecionadas.',
    },
    validity: { es: 'Hasta fin de mes', pt: 'Até o fim do mês' },
    color: '#C2185B',
  },
]

export interface Service {
  icon: string
  title: Record<Locale, string>
  body: Record<Locale, string>
}

// PLACEHOLDER — ajustar a los servicios reales de la tienda.
export const services: Service[] = [
  {
    icon: '🧑‍💼',
    title: { es: 'Asesoramiento personalizado', pt: 'Atendimento personalizado' },
    body: {
      es: 'Nuestro equipo te ayuda a elegir el regalo o producto ideal.',
      pt: 'Nossa equipe ajuda você a escolher o presente ou produto ideal.',
    },
  },
  {
    icon: '🌐',
    title: { es: 'Atención bilingüe', pt: 'Atendimento bilíngue' },
    body: { es: 'Te atendemos en español y portugués.', pt: 'Atendemos em espanhol e português.' },
  },
  {
    icon: '🎁',
    title: { es: 'Empaque para regalo', pt: 'Embalagem para presente' },
    body: {
      es: 'Preparamos tu compra para que llegue lista para regalar.',
      pt: 'Preparamos sua compra pronta para presentear.',
    },
  },
  {
    icon: '🅿️',
    title: { es: 'Estacionamiento', pt: 'Estacionamento' },
    body: {
      es: 'Espacio disponible para que llegues cómodo a la tienda.',
      pt: 'Espaço disponível para você chegar com conforto à loja.',
    },
  },
  {
    icon: '📶',
    title: { es: 'Wi-Fi gratuito', pt: 'Wi-Fi gratuito' },
    body: { es: 'Conexión libre mientras recorrés la tienda.', pt: 'Conexão livre enquanto você percorre a loja.' },
  },
  {
    icon: '🛍️',
    title: { es: 'Reserva online (próximamente)', pt: 'Reserva online (em breve)' },
    body: {
      es: 'Muy pronto vas a poder reservar tus productos antes de viajar.',
      pt: 'Em breve você poderá reservar seus produtos antes de viajar.',
    },
  },
]

export interface NewsItem {
  date: Record<Locale, string>
  title: Record<Locale, string>
  body: Record<Locale, string>
  tag: Record<Locale, string>
}

// PLACEHOLDER — cargar las novedades reales de la tienda.
export const news: NewsItem[] = [
  {
    date: { es: 'Julio 2026', pt: 'Julho 2026' },
    tag: { es: 'Novedad', pt: 'Novidade' },
    title: { es: 'Nuevas fragancias de temporada', pt: 'Novas fragrâncias da temporada' },
    body: {
      es: 'Sumamos los últimos lanzamientos de las casas de perfumería más reconocidas.',
      pt: 'Adicionamos os últimos lançamentos das casas de perfumaria mais reconhecidas.',
    },
  },
  {
    date: { es: 'Julio 2026', pt: 'Julho 2026' },
    tag: { es: 'Tecnología', pt: 'Tecnologia' },
    title: { es: 'Llegó la nueva línea de audio', pt: 'Chegou a nova linha de áudio' },
    body: {
      es: 'Auriculares y parlantes de las mejores marcas, con precios duty free.',
      pt: 'Fones e caixas de som das melhores marcas, com preços duty free.',
    },
  },
  {
    date: { es: 'Julio 2026', pt: 'Julho 2026' },
    tag: { es: 'Evento', pt: 'Evento' },
    title: { es: 'Semana de degustaciones', pt: 'Semana de degustações' },
    body: {
      es: 'Visitanos y descubrí nuestra selección de bebidas premium.',
      pt: 'Visite-nos e descubra nossa seleção de bebidas premium.',
    },
  },
]

export interface SocialLink {
  name: string
  url: string
  icon: 'instagram' | 'facebook'
}

// PLACEHOLDER — confirmar las URLs oficiales de redes sociales.
export const socials: SocialLink[] = [
  { name: 'Instagram', url: 'https://www.instagram.com/dutyfreeshoppuertoiguazu', icon: 'instagram' },
  { name: 'Facebook', url: 'https://www.facebook.com/dutyfreeshoppuertoiguazu', icon: 'facebook' },
]
