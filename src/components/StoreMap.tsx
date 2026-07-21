import { useState } from 'react'
import { MapPin } from 'lucide-react'
import { useLocale } from '../context/AppContext'
import Reveal from './Reveal'
import { storeSectors, type StoreSector } from '../storeMap'

const VIEW_W = 1000
const VIEW_H = 620

export default function StoreMap() {
  const { locale, tr } = useLocale()
  const [activeId, setActiveId] = useState<string>(storeSectors[0]?.id ?? '')
  const active: StoreSector | undefined = storeSectors.find(s => s.id === activeId)

  return (
    <section id="mapa" className="section store-map-section">
      <Reveal>
        <div className="section-head">
          <div>
            <span className="kicker">{tr('mapKicker')}</span>
            <h2>{tr('mapTitle')}</h2>
            <p>{tr('mapBody')}</p>
          </div>
        </div>
      </Reveal>

      <Reveal>
        <div className="store-map">
          <div className="store-map-plan">
            <svg
              viewBox={`0 0 ${VIEW_W} ${VIEW_H}`}
              className="store-map-svg"
              role="group"
              aria-label={tr('mapTitle')}
            >
              {/* piso / marco */}
              <rect x="8" y="8" width={VIEW_W - 16} height={VIEW_H - 16} rx="18" className="map-floor" />

              {storeSectors.map(sector => {
                const on = sector.id === activeId
                const { x, y, w, h } = sector.rect
                return (
                  <g
                    key={sector.id}
                    className={on ? 'map-zone on' : 'map-zone'}
                    onMouseEnter={() => setActiveId(sector.id)}
                    onClick={() => setActiveId(sector.id)}
                    tabIndex={0}
                    role="button"
                    aria-pressed={on}
                    aria-label={sector.name[locale]}
                    onKeyDown={e => {
                      if (e.key === 'Enter' || e.key === ' ') {
                        e.preventDefault()
                        setActiveId(sector.id)
                      }
                    }}
                  >
                    <rect
                      x={x}
                      y={y}
                      width={w}
                      height={h}
                      rx="14"
                      className="map-zone-rect"
                      style={{ fill: sector.color, stroke: sector.color }}
                    />
                    <text x={x + w / 2} y={y + h / 2 - 14} className="map-zone-icon" textAnchor="middle">
                      {sector.icon}
                    </text>
                    <text x={x + w / 2} y={y + h / 2 + 30} className="map-zone-label" textAnchor="middle">
                      {sector.name[locale]}
                    </text>
                  </g>
                )
              })}

              {/* accesos */}
              <g className="map-door" aria-hidden="true">
                <rect x={VIEW_W / 2 - 70} y={VIEW_H - 20} width="140" height="16" rx="6" />
                <text x={VIEW_W / 2} y={VIEW_H - 30} textAnchor="middle" className="map-door-label">
                  {tr('mapEntrance')}
                </text>
              </g>
            </svg>
            <p className="store-map-hint">
              <MapPin size={15} /> {tr('mapHint')}
            </p>
          </div>

          <aside className="store-map-panel" aria-live="polite">
            {active ? (
              <>
                <div className="store-map-panel-head" style={{ borderColor: active.color }}>
                  <span className="store-map-panel-icon" style={{ background: active.color }}>
                    {active.icon}
                  </span>
                  <h3>{active.name[locale]}</h3>
                </div>
                <span className="store-map-panel-label">{tr('mapBrandsLabel')}</span>
                <ul className="store-map-brands">
                  {active.brands.map(brand => (
                    <li key={brand} style={{ borderColor: active.color }}>
                      {brand}
                    </li>
                  ))}
                </ul>
              </>
            ) : (
              <p className="store-map-empty">{tr('mapPickPrompt')}</p>
            )}
          </aside>
        </div>
      </Reveal>
    </section>
  )
}
