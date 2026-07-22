import { Link } from 'react-router-dom'
import { ArrowRight, Clock3, MapPin, PackageCheck, Quote, ShieldCheck, Tag } from 'lucide-react'
import { hero, mapsUrl, resolveImage, storeAddress, storeCity } from '../assets'
import BankPromos from '../components/BankPromos'
import FaqSection from '../components/FaqSection'
import Newsletter from '../components/Newsletter'
import PaymentMethods from '../components/PaymentMethods'
import ProductCard, { ProductCardSkeleton } from '../components/ProductCard'
import Reveal from '../components/Reveal'
import Services from '../components/Services'
import StoreMap from '../components/StoreMap'
import StoreNews from '../components/StoreNews'
import VisitorInfo from '../components/VisitorInfo'
import { RESERVAS_ENABLED } from '../config'
import { useLocale, useStoreData } from '../context/AppContext'
import type { UiKey } from '../i18n'
import type { Category } from '../types'

export default function Home() {
  return (
    <>
      <Hero />
      <TrustStrip />
      <CategoryShowcase />
      <BankPromos />
      <OffersSection />
      <StoreNews />
      <FeaturedSection />
      <StoreMap />
      <BrandMarquee />
      <VisitorInfo />
      <Services />
      <PaymentMethods />
      {RESERVAS_ENABLED && <HowSection />}
      {RESERVAS_ENABLED && <Testimonials />}
      <FaqSection />
      <VisitSection />
      <Newsletter />
    </>
  )
}

function Hero() {
  const { tr, path } = useLocale()
  return (
    <section className="hero">
      <div className="hero-media">
        <img
          src={hero}
          alt="Duty Free Shop Puerto Iguazú al atardecer"
          fetchPriority="high"
          decoding="async"
        />
        <div className="hero-shade" />
      </div>
      <div className="hero-content">
        <div className="eyebrow">{tr('heroEyebrow')}</div>
        <h1>{tr('heroTitle')}</h1>
        <p>{tr('heroBody')}</p>
        <div className="hero-buttons">
          <Link className="button gold" to={path('/catalogo')}>
            {tr('explore')} <ArrowRight size={18} />
          </Link>
          <Link className="button ghost" to={path('/#ofertas')}>
            {tr('heroOffers')}
          </Link>
        </div>
      </div>
      <div className="hero-note">
        <MapPin size={18} />
        <span>
          Ruta 12 · Paso de Frontera
          <br />
          <b>{tr('heroLocation')}</b>
        </span>
      </div>
    </section>
  )
}

function TrustStrip() {
  const { tr } = useLocale()
  const entries = [
    { icon: <ShieldCheck />, title: tr('trust1'), body: tr('trust1b') },
    { icon: <PackageCheck />, title: tr('trust2'), body: tr('trust2b') },
    { icon: <Clock3 />, title: tr('trust3'), body: tr('trust3b') },
  ]
  return (
    <section className="trust-strip">
      {entries.map(entry => (
        <div key={entry.title}>
          {entry.icon}
          <span>
            <b>{entry.title}</b>
            <small>{entry.body}</small>
          </span>
        </div>
      ))}
    </section>
  )
}

const CATEGORY_CARDS: { category: Category; blurbKey: UiKey }[] = [
  { category: 'perfumes', blurbKey: 'catPerfumesB' },
  { category: 'bebidas', blurbKey: 'catBebidasB' },
  { category: 'delicatessen', blurbKey: 'catDelicatessenB' },
  { category: 'tecnologia', blurbKey: 'catTecnologiaB' },
]

function CategoryShowcase() {
  const { tr, path } = useLocale()
  const { products } = useStoreData()
  const imageFor = (category: Category) => products.find(p => p.category === category)?.image
  return (
    <section id="categorias" className="section category-section">
      <Reveal>
        <div className="section-head">
          <div>
            <span className="kicker">{tr('categoriesKicker')}</span>
            <h2>{tr('categoriesTitle')}</h2>
            <p>{tr('categoriesBody')}</p>
          </div>
        </div>
      </Reveal>
      <div className="category-showcase">
        {CATEGORY_CARDS.map((card, index) => (
          <Reveal key={card.category} delay={index * 90}>
            <Link to={`${path('/catalogo')}?cat=${card.category}`} className="category-card">
              {imageFor(card.category) && (
                <img src={resolveImage(imageFor(card.category)!)} alt={tr(card.category)} loading="lazy" />
              )}
              <div className="category-copy">
                <h3>{tr(card.category)}</h3>
                <p>{tr(card.blurbKey)}</p>
                <span>
                  {tr('viewCategory')} <ArrowRight size={15} />
                </span>
              </div>
            </Link>
          </Reveal>
        ))}
      </div>
    </section>
  )
}

function OffersSection() {
  const { tr, path } = useLocale()
  const { products, loading } = useStoreData()
  const offers = products.filter(p => p.originalPrice && p.originalPrice > p.price).slice(0, 4)
  if (!loading && !offers.length) return null
  return (
    <section id="ofertas" className="section offers-section">
      <Reveal>
        <div className="section-head">
          <div>
            <span className="kicker gold-kicker">
              <Tag size={14} /> {tr('offersKicker')}
            </span>
            <h2>{tr('offersTitle')}</h2>
            <p>{tr('offersBody')}</p>
          </div>
          <Link to={path('/catalogo')} className="text-link">
            {tr('offersCta')} <ArrowRight size={16} />
          </Link>
        </div>
      </Reveal>
      <Reveal>
        <div className="product-grid offers-grid">
          {loading
            ? Array.from({ length: 4 }, (_, i) => <ProductCardSkeleton key={i} />)
            : offers.map(product => <ProductCard key={product.id} product={product} />)}
        </div>
      </Reveal>
    </section>
  )
}

function FeaturedSection() {
  const { tr, path } = useLocale()
  const { products, loading } = useStoreData()
  const featured = products.filter(p => p.featured).slice(0, 5)
  return (
    <section className="section featured">
      <Reveal>
        <div className="section-head">
          <div>
            <span className="kicker">{tr('curationKicker')}</span>
            <h2>{tr('featured')}</h2>
            <p>{tr('featuredBody')}</p>
          </div>
          <Link to={path('/catalogo')} className="text-link">
            {tr('viewAll')} <ArrowRight size={16} />
          </Link>
        </div>
      </Reveal>
      <Reveal>
        <div className="product-grid">
          {loading
            ? Array.from({ length: 5 }, (_, i) => <ProductCardSkeleton key={i} />)
            : featured.map(product => <ProductCard key={product.id} product={product} />)}
        </div>
      </Reveal>
    </section>
  )
}

function HowSection() {
  const { tr, path } = useLocale()
  const steps: [string, UiKey, UiKey][] = [
    ['01', 'step1', 'step1b'],
    ['02', 'step2', 'step2b'],
    ['03', 'step3', 'step3b'],
  ]
  return (
    <section id="como" className="how-section">
      <Reveal className="how-copy">
        <span className="kicker light">{tr('howKicker')}</span>
        <h2>{tr('howTitle')}</h2>
        <p>{tr('howBody')}</p>
        <Link to={path('/catalogo')} className="button gold">
          {tr('reserve')} <ArrowRight size={18} />
        </Link>
      </Reveal>
      <div className="steps">
        {steps.map(([nStep, title, body], index) => (
          <Reveal key={nStep} delay={index * 100}>
            <div className="step">
              <span>{nStep}</span>
              <div>
                <h3>{tr(title)}</h3>
                <p>{tr(body)}</p>
              </div>
            </div>
          </Reveal>
        ))}
      </div>
    </section>
  )
}

function BrandMarquee() {
  const { tr } = useLocale()
  const { products } = useStoreData()
  const brands = [...new Set(products.map(p => p.brand))]
  if (!brands.length) return null
  return (
    <section className="brand-marquee" aria-label={tr('brandsKicker')}>
      <span className="kicker">{tr('brandsKicker')}</span>
      <div className="brand-viewport">
        <div className="brand-track">
          {[...brands, ...brands].map((brand, index) => (
            <span key={`${brand}-${index}`}>{brand}</span>
          ))}
        </div>
      </div>
    </section>
  )
}

function Testimonials() {
  const { tr } = useLocale()
  const entries: [UiKey, UiKey][] = [
    ['t1q', 't1a'],
    ['t2q', 't2a'],
    ['t3q', 't3a'],
  ]
  return (
    <section className="section testimonials">
      <Reveal>
        <div className="section-head">
          <div>
            <span className="kicker">{tr('testimonialsKicker')}</span>
            <h2>{tr('testimonialsTitle')}</h2>
          </div>
        </div>
      </Reveal>
      <div className="testimonial-grid">
        {entries.map(([quote, author], index) => (
          <Reveal key={author} delay={index * 100}>
            <figure className="testimonial-card">
              <Quote size={22} />
              <blockquote>{tr(quote)}</blockquote>
              <figcaption>{tr(author)}</figcaption>
            </figure>
          </Reveal>
        ))}
      </div>
    </section>
  )
}

function VisitSection() {
  const { tr } = useLocale()
  return (
    <section className="visit">
      <Reveal>
        <div>
          <span className="kicker light">{tr('visitKicker')}</span>
          <h2>{tr('visitTitle')}</h2>
          <a className="map-link" href={mapsUrl} target="_blank" rel="noreferrer">
            {tr('visitMap')} <ArrowRight size={15} />
          </a>
        </div>
      </Reveal>
      <Reveal delay={120}>
        <div className="visit-details">
          <p>
            <MapPin />
            {storeAddress}
            <br />
            {storeCity}
          </p>
          <p>
            <Clock3 />
            {tr('visitDays')}
          </p>
        </div>
      </Reveal>
    </section>
  )
}
