import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import {
  ArrowLeft,
  Clock3,
  Mail,
  MapPin,
  Minus,
  Phone,
  Plus,
  ShieldCheck,
  ShoppingBag,
} from "lucide-react";
import { track } from "../analytics";
import { mapsUrl, resolveImage, storeEmail, storePhone } from "../assets";
import { RESERVAS_ENABLED } from "../config";
import { useCart, useLocale, useStoreData } from "../context/AppContext";
import NotFound from "./NotFound";

export default function ProductDetail() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { locale, tr, path } = useLocale();
  const { products, loading } = useStoreData();
  const { add } = useCart();
  const [quantity, setQuantity] = useState(1);

  const product = products.find((p) => p.id === id || p.slug === id);

  useEffect(() => {
    if (!product) return;
    track("product_view", {
      locale,
      product: product.slug || product.id,
      category: product.category,
    });
  }, [locale, product]);
  if (loading && !product) {
    return (
      <div className="page empty">
        <Clock3 />
        <h1>{tr("loading")}</h1>
      </div>
    );
  }
  if (!product) return <NotFound />;

  const addAndGo = () => {
    add(product.id, quantity);
    navigate(path("/seleccion"));
  };
  const productKey = product.slug || product.id;
  const productTitle = product.name
    .toLocaleLowerCase()
    .startsWith(product.brand.toLocaleLowerCase())
    ? product.name
    : `${product.brand} ${product.name}`;
  const emailSubject = encodeURIComponent(
    `${tr("productEmailSubject")}: ${productTitle}`,
  );

  return (
    <div className="page detail-page">
      <button className="back" onClick={() => navigate(-1)}>
        <ArrowLeft /> {tr("back")}
      </button>
      <div className="detail-grid">
        <div className="detail-image">
          <img
            src={resolveImage(product.image)}
            alt={`${product.brand} ${product.name}`}
          />
        </div>
        <div className="detail-copy">
          <span className="brand-name">{product.brand}</span>
          <h1>{product.name}</h1>
          <p className="product-subtitle">{product.subtitle[locale]}</p>
          {RESERVAS_ENABLED && (
            <div className="detail-price">
              <small>USD</small>
              <strong>{product.price}</strong>
              {product.originalPrice && <del>USD {product.originalPrice}</del>}
            </div>
          )}
          {RESERVAS_ENABLED && (
            <div className="availability big">
              <i className={product.stock < 5 ? "low" : ""} />
              {product.stock < 5 ? tr("lastUnits") : tr("available")} ·{" "}
              {product.stock} {tr("inStock")}
            </div>
          )}
          <p className="description">{product.description[locale]}</p>
          {RESERVAS_ENABLED ? (
            <>
              <div className="quantity">
                <button
                  onClick={() => setQuantity(Math.max(1, quantity - 1))}
                  aria-label="-"
                >
                  <Minus />
                </button>
                <span>{quantity}</span>
                <button
                  onClick={() =>
                    setQuantity(Math.min(product.stock, quantity + 1))
                  }
                  aria-label="+"
                >
                  <Plus />
                </button>
              </div>
              <button className="button navy wide" onClick={addAndGo}>
                <ShoppingBag /> {tr("add")}
              </button>
              <div className="detail-benefits">
                <p>
                  <ShieldCheck /> {tr("noPrepay")}
                </p>
                <p>
                  <Clock3 /> {tr("pickupDays")}
                </p>
              </div>
            </>
          ) : (
            <div className="detail-instore">
              <p className="instore-badge">
                <MapPin size={18} /> {tr("inStoreOnly")}
              </p>
              <div className="detail-benefits">
                <p>
                  <ShieldCheck /> {tr("trust2")}
                </p>
                <p>
                  <MapPin /> {tr("heroLocation")}
                </p>
              </div>
              <p className="detail-info-note">{tr("productInfoNote")}</p>
              <div className="detail-actions">
                <a
                  className="button navy"
                  href={`mailto:${storeEmail}?subject=${emailSubject}`}
                  onClick={() =>
                    track("product_contact", {
                      locale,
                      product: productKey,
                      channel: "email",
                    })
                  }
                >
                  <Mail /> {tr("consultProduct")}
                </a>
                <a
                  className="button outline"
                  href={`tel:${storePhone.replace(/\s/g, "")}`}
                  onClick={() =>
                    track("product_contact", {
                      locale,
                      product: productKey,
                      channel: "phone",
                    })
                  }
                >
                  <Phone /> {tr("callStore")}
                </a>
                <a
                  className="button outline"
                  href={mapsUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  onClick={() =>
                    track("store_directions", {
                      locale,
                      source: "product",
                      product: productKey,
                    })
                  }
                >
                  <MapPin /> {tr("directions")}
                </a>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
