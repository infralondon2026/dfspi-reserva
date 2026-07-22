import type { Locale } from './types'

/**
 * Sectores del plano OFICIAL de la tienda (public/img/store-map.png).
 *
 * `rect` está en PORCENTAJE (0–100) relativo a la imagen del plano: define la
 * zona clickeable que se superpone sobre cada local. Ajustar esos valores
 * recalibra los hotspots sin tocar código.
 *
 * PARA REVISIÓN DE MARKETING: las marcas de cada sector son una aproximación
 * editable; reemplazar por las marcas reales de cada local.
 */
export interface StoreSector {
  id: string
  name: Record<Locale, string>
  icon: string
  /** Color de acento (paleta del plano: navy / teal / coral). */
  color: string
  brands: string[]
  /** Zona clickeable en % de la imagen del plano: {x, y, w, h}. */
  rect: { x: number; y: number; w: number; h: number }
}

const NAVY = '#1b2a52'
const TEAL = '#3fb0a6'
const CORAL = '#ef8a6f'

export const storeSectors: StoreSector[] = [
  {
    id: 'istore',
    name: { es: 'iStore', pt: 'iStore', en: 'iStore' },
    icon: '📱',
    color: NAVY,
    brands: ['Apple'],
    rect: { x: 27, y: 18, w: 13, h: 15 },
  },
  {
    id: 'electronica',
    name: { es: 'Electrónica', pt: 'Eletrônica', en: 'Electronics' },
    icon: '🎧',
    color: NAVY,
    brands: ['Samsung', 'JBL', 'Bose', 'GoPro', 'Xiaomi'],
    rect: { x: 42, y: 18, w: 12, h: 15 },
  },
  {
    id: 'cosmetica',
    name: { es: 'Cosmética', pt: 'Cosmética', en: 'Cosmetics' },
    icon: '💄',
    color: TEAL,
    brands: ['Clinique', 'Estée Lauder', 'Lancôme', 'Clarins'],
    rect: { x: 58, y: 18, w: 12, h: 15 },
  },
  {
    id: 'lentes-top',
    name: { es: 'Lentes', pt: 'Óculos', en: 'Eyewear' },
    icon: '🕶️',
    color: CORAL,
    brands: ['Ray-Ban', 'Oakley'],
    rect: { x: 71, y: 18, w: 6, h: 19 },
  },
  {
    id: 'tommy',
    name: { es: 'Tommy Hilfiger', pt: 'Tommy Hilfiger', en: 'Tommy Hilfiger' },
    icon: '👕',
    color: NAVY,
    brands: ['Tommy Hilfiger'],
    rect: { x: 26, y: 35, w: 11, h: 13 },
  },
  {
    id: 'perfumeria',
    name: { es: 'Perfumería', pt: 'Perfumaria', en: 'Fragrances' },
    icon: '🌸',
    color: TEAL,
    brands: ['Carolina Herrera', 'Giorgio Armani', 'Dior', 'Chanel', 'Paco Rabanne', 'Cacharel', 'Moncler'],
    rect: { x: 42, y: 35, w: 26, h: 13 },
  },
  {
    id: 'jugueteria',
    name: { es: 'Juguetería', pt: 'Brinquedos', en: 'Toys' },
    icon: '🧸',
    color: CORAL,
    brands: ['LEGO', 'Playmobil', 'Hot Wheels'],
    rect: { x: 78, y: 36, w: 10, h: 14 },
  },
  {
    id: 'bar-chivas',
    name: { es: 'Bar de Chivas', pt: 'Bar de Chivas', en: 'Chivas Bar' },
    icon: '🥃',
    color: TEAL,
    brands: ['Chivas Regal'],
    rect: { x: 35, y: 45, w: 9, h: 14 },
  },
  {
    id: 'equipajes',
    name: { es: 'Equipajes', pt: 'Bagagens', en: 'Luggage' },
    icon: '🧳',
    color: TEAL,
    brands: ['Samsonite', 'Victorinox', 'Montblanc'],
    rect: { x: 44, y: 48, w: 10, h: 10 },
  },
  {
    id: 'lentes-centro',
    name: { es: 'Lentes', pt: 'Óculos', en: 'Eyewear' },
    icon: '👓',
    color: NAVY,
    brands: ['Ray-Ban', 'Persol', 'Vogue'],
    rect: { x: 60, y: 48, w: 7, h: 11 },
  },
  {
    id: 'deportes',
    name: { es: 'Deportes', pt: 'Esportes', en: 'Sports' },
    icon: '👟',
    color: TEAL,
    brands: ['Nike', 'adidas', 'Under Armour'],
    rect: { x: 80, y: 48, w: 9, h: 10 },
  },
  {
    id: 't-tommy',
    name: { es: 'Tommy (accesorios)', pt: 'Tommy (acessórios)', en: 'Tommy (accessories)' },
    icon: '🧢',
    color: NAVY,
    brands: ['Tommy Hilfiger'],
    rect: { x: 25, y: 48, w: 8, h: 9 },
  },
  {
    id: 'modas',
    name: { es: 'Modas', pt: 'Moda', en: 'Fashion' },
    icon: '🧥',
    color: NAVY,
    brands: ['Lacoste', 'Calvin Klein', 'Guess'],
    rect: { x: 13, y: 50, w: 12, h: 18 },
  },
  {
    id: 'victorias-secret',
    name: { es: "Victoria's Secret", pt: "Victoria's Secret", en: "Victoria's Secret" },
    icon: '💗',
    color: CORAL,
    brands: ["Victoria's Secret"],
    rect: { x: 26, y: 57, w: 10, h: 11 },
  },
  {
    id: 'bebidas',
    name: { es: 'Bebidas', pt: 'Bebidas', en: 'Beverages' },
    icon: '🍸',
    color: NAVY,
    brands: ['Johnnie Walker', 'Jägermeister', 'Baileys', 'Absolut', 'Amarula'],
    rect: { x: 43, y: 55, w: 9, h: 13 },
  },
  {
    id: 'vinos',
    name: { es: 'Vinos', pt: 'Vinhos', en: 'Wines' },
    icon: '🍷',
    color: NAVY,
    brands: ['Moët & Chandon', 'Chandon', 'Rutini'],
    rect: { x: 53, y: 55, w: 9, h: 13 },
  },
  {
    id: 'comestibles',
    name: { es: 'Comestibles', pt: 'Comestíveis', en: 'Food' },
    icon: '🍫',
    color: CORAL,
    brands: ['Lindt', 'Toblerone', 'Ferrero Rocher', 'Godiva'],
    rect: { x: 62, y: 57, w: 9, h: 11 },
  },
  {
    id: 'mac',
    name: { es: 'MAC', pt: 'MAC', en: 'MAC' },
    icon: '💅',
    color: TEAL,
    brands: ['MAC Cosmetics'],
    rect: { x: 71, y: 59, w: 7, h: 9 },
  },
  {
    id: 'bazar',
    name: { es: 'Bazar', pt: 'Bazar', en: 'Gifts' },
    icon: '🎁',
    color: TEAL,
    brands: ['Regalería', 'Souvenirs'],
    rect: { x: 78, y: 56, w: 10, h: 10 },
  },
]
