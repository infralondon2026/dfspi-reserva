import type { Locale } from './types'

/**
 * Mapa esquemático de la tienda para la sección interactiva.
 *
 * PARA REVISIÓN: los sectores, sus marcas y su ubicación en el plano son una
 * aproximación editable. Ajustar `sectors` a la distribución real del local.
 * Las coordenadas (x, y, w, h) están en el sistema del SVG de 1000×620 que
 * dibuja StoreMap.tsx; moverlas reacomoda las zonas del plano sin tocar código.
 */
export interface StoreSector {
  id: string
  name: Record<Locale, string>
  /** Emoji ilustrativo del sector. */
  icon: string
  /** Color de acento de la zona (paleta de marca). */
  color: string
  /** Marcas destacadas del sector. */
  brands: string[]
  /** Rectángulo de la zona dentro del SVG 1000×620. */
  rect: { x: number; y: number; w: number; h: number }
}

export const storeSectors: StoreSector[] = [
  {
    id: 'perfumeria',
    name: { es: 'Perfumería', pt: 'Perfumaria' },
    icon: '🌸',
    color: '#C2185B',
    brands: ['Carolina Herrera', 'Giorgio Armani', 'Cacharel', 'Moncler', 'Dior', 'Chanel', 'Paco Rabanne', 'Lancôme'],
    rect: { x: 40, y: 40, w: 300, h: 240 },
  },
  {
    id: 'cosmetica',
    name: { es: 'Cosmética & Skincare', pt: 'Cosmética & Skincare' },
    icon: '💄',
    color: '#7B1FA2',
    brands: ['Clinique', 'Estée Lauder', 'MAC', 'La Roche-Posay', 'Clarins'],
    rect: { x: 360, y: 40, w: 260, h: 240 },
  },
  {
    id: 'bebidas',
    name: { es: 'Bebidas & Licores', pt: 'Bebidas & Licores' },
    icon: '🥃',
    color: '#B8860B',
    brands: ['Chivas Regal', 'Johnnie Walker', 'Jägermeister', 'Amarula', 'Absolut', 'Baileys', 'Moët & Chandon'],
    rect: { x: 640, y: 40, w: 320, h: 240 },
  },
  {
    id: 'tecnologia',
    name: { es: 'Electrónica & Tecnología', pt: 'Eletrônica & Tecnologia' },
    icon: '🎧',
    color: '#0B6EB6',
    brands: ['Apple', 'Samsung', 'JBL', 'Bose', 'GoPro', 'Xiaomi'],
    rect: { x: 40, y: 300, w: 300, h: 240 },
  },
  {
    id: 'delicatessen',
    name: { es: 'Delicatessen & Chocolates', pt: 'Delicatessen & Chocolates' },
    icon: '🍫',
    color: '#8D6E63',
    brands: ['Lindt', 'Toblerone', 'Ferrero Rocher', 'Godiva', "M&M's"],
    rect: { x: 360, y: 300, w: 260, h: 240 },
  },
  {
    id: 'accesorios',
    name: { es: 'Moda & Accesorios', pt: 'Moda & Acessórios' },
    icon: '🕶️',
    color: '#00695C',
    brands: ['Ray-Ban', 'Swatch', 'Victorinox', 'Samsonite', 'Montblanc'],
    rect: { x: 640, y: 300, w: 320, h: 240 },
  },
]
