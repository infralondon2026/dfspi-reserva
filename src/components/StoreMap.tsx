import { useState } from "react";
import { MapPin } from "lucide-react";
import { asset } from "../assets";
import { useLocale } from "../context/AppContext";
import Reveal from "./Reveal";
import { storeSectors, type StoreSector } from "../storeMap";

export default function StoreMap() {
  const { locale, tr } = useLocale();
  const [activeId, setActiveId] = useState<string>(storeSectors[0]?.id ?? "");
  const [hasImage, setHasImage] = useState(true);
  const active: StoreSector | undefined = storeSectors.find(
    (s) => s.id === activeId,
  );

  return (
    <section id="mapa" className="section store-map-section">
      <Reveal>
        <div className="section-head">
          <div>
            <span className="kicker">{tr("mapKicker")}</span>
            <h2>{tr("mapTitle")}</h2>
            <p>{tr("mapBody")}</p>
          </div>
        </div>
      </Reveal>

      <Reveal>
        <div className="store-map">
          <div className="store-map-plan">
            <div
              className={
                hasImage ? "store-map-figure" : "store-map-figure no-image"
              }
            >
              <img
                src={asset("img/store-map-optimized.jpg")}
                alt={tr("mapTitle")}
                className="store-map-image"
                loading="lazy"
                decoding="async"
                onError={() => setHasImage(false)}
              />
              {/* Hotspots: zonas clickeables posicionadas en % sobre el plano */}
              {storeSectors.map((sector) => {
                const on = sector.id === activeId;
                return (
                  <button
                    key={sector.id}
                    type="button"
                    className={on ? "map-hotspot on" : "map-hotspot"}
                    style={{
                      left: `${sector.rect.x}%`,
                      top: `${sector.rect.y}%`,
                      width: `${sector.rect.w}%`,
                      height: `${sector.rect.h}%`,
                      // el resaltado usa el color del sector
                      ["--hot" as string]: sector.color,
                    }}
                    onMouseEnter={() => setActiveId(sector.id)}
                    onFocus={() => setActiveId(sector.id)}
                    onClick={() => setActiveId(sector.id)}
                    aria-label={sector.name[locale]}
                    aria-pressed={on}
                  />
                );
              })}
            </div>

            {/* Selector accesible (teclado / mobile / respaldo si falta la imagen) */}
            <div
              className="store-map-chips"
              role="tablist"
              aria-label={tr("mapTitle")}
            >
              {storeSectors.map((sector) => {
                const on = sector.id === activeId;
                return (
                  <button
                    key={sector.id}
                    type="button"
                    role="tab"
                    aria-selected={on}
                    className={on ? "store-map-chip on" : "store-map-chip"}
                    style={
                      on
                        ? { borderColor: sector.color, color: sector.color }
                        : undefined
                    }
                    onMouseEnter={() => setActiveId(sector.id)}
                    onClick={() => setActiveId(sector.id)}
                  >
                    <span aria-hidden="true">{sector.icon}</span>{" "}
                    {sector.name[locale]}
                  </button>
                );
              })}
            </div>

            <p className="store-map-hint">
              <MapPin size={15} /> {tr("mapHint")}
            </p>
          </div>

          <aside className="store-map-panel" aria-live="polite">
            {active ? (
              <>
                <div
                  className="store-map-panel-head"
                  style={{ borderColor: active.color }}
                >
                  <span
                    className="store-map-panel-icon"
                    style={{ background: active.color }}
                  >
                    {active.icon}
                  </span>
                  <h3>{active.name[locale]}</h3>
                </div>
                <span className="store-map-panel-label">
                  {tr("mapBrandsLabel")}
                </span>
                <ul className="store-map-brands">
                  {active.brands.map((brand) => (
                    <li key={brand} style={{ borderColor: active.color }}>
                      {brand}
                    </li>
                  ))}
                </ul>
              </>
            ) : (
              <p className="store-map-empty">{tr("mapPickPrompt")}</p>
            )}
          </aside>
        </div>
      </Reveal>
    </section>
  );
}
