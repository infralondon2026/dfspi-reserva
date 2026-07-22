import { useEffect, useMemo, useState } from "react";
import { useSearchParams } from "react-router-dom";
import { Info, Search } from "lucide-react";
import { track } from "../analytics";
import ProductCard, { ProductCardSkeleton } from "../components/ProductCard";
import { RESERVAS_ENABLED } from "../config";
import { useLocale, useStoreData } from "../context/AppContext";
import type { UiKey } from "../i18n";
import type { Category, Product } from "../types";

type CategoryFilter = "all" | Category;
type SortMode = "recommended" | "priceAsc" | "priceDesc" | "discount";

const CATEGORIES: [CategoryFilter, UiKey][] = [
  ["all", "all"],
  ["perfumes", "perfumes"],
  ["bebidas", "bebidas"],
  ["delicatessen", "delicatessen"],
  ["tecnologia", "tecnologia"],
];

const SORTS: [SortMode, UiKey][] = [
  ["recommended", "sortRecommended"],
  ["priceAsc", "sortPriceAsc"],
  ["priceDesc", "sortPriceDesc"],
  ["discount", "sortDiscount"],
];

const discountOf = (p: Product) =>
  p.originalPrice ? 1 - p.price / p.originalPrice : 0;

export default function Catalog() {
  const { locale, tr } = useLocale();
  const { products, loading } = useStoreData();
  const [params, setParams] = useSearchParams();
  const [query, setQuery] = useState("");
  const [brand, setBrand] = useState("all");
  const [sort, setSort] = useState<SortMode>("recommended");
  const availableSorts = RESERVAS_ENABLED
    ? SORTS
    : SORTS.filter(([id]) => id === "recommended");
  const brands = useMemo(
    () =>
      [...new Set(products.map((product) => product.brand))].sort((a, b) =>
        a.localeCompare(b),
      ),
    [products],
  );
  const updatedAt = new Intl.DateTimeFormat(
    locale === "pt" ? "pt-BR" : locale === "en" ? "en-US" : "es-AR",
    { day: "numeric", month: "long", year: "numeric" },
  ).format(new Date("2026-07-22T12:00:00-03:00"));

  useEffect(() => {
    if (query.trim().length < 2) return;
    const timer = window.setTimeout(() => {
      track("catalog_search", { locale, queryLength: query.trim().length });
    }, 700);
    return () => window.clearTimeout(timer);
  }, [locale, query]);

  const rawCategory = params.get("cat");
  const category: CategoryFilter = CATEGORIES.some(([id]) => id === rawCategory)
    ? (rawCategory as CategoryFilter)
    : "all";

  const setCategory = (next: CategoryFilter) => {
    setParams(next === "all" ? {} : { cat: next }, { replace: true });
    track("catalog_filter", { locale, filter: "category", value: next });
  };

  const filtered = useMemo(() => {
    const needle = query.toLowerCase();
    const matches = products.filter(
      (p) =>
        (category === "all" || p.category === category) &&
        (brand === "all" || p.brand === brand) &&
        `${p.brand} ${p.name}`.toLowerCase().includes(needle),
    );
    switch (sort) {
      case "priceAsc":
        return [...matches].sort((a, b) => a.price - b.price);
      case "priceDesc":
        return [...matches].sort((a, b) => b.price - a.price);
      case "discount":
        return [...matches].sort((a, b) => discountOf(b) - discountOf(a));
      default:
        return matches;
    }
  }, [products, brand, category, query, sort]);

  return (
    <div className="page catalog-page">
      <div className="page-title">
        <span className="kicker">{tr("catalogKicker")}</span>
        <h1>{tr("catalogTitle")}</h1>
        <p>{tr("catalogBody")}</p>
      </div>
      {!RESERVAS_ENABLED && (
        <div className="catalog-mode-note" role="note">
          <Info aria-hidden="true" />
          <p>{tr("catalogNotice")}</p>
        </div>
      )}
      <div className="catalog-tools">
        <label className="search">
          <Search />
          <input
            value={query}
            onChange={(event) => setQuery(event.target.value)}
            placeholder={tr("search")}
          />
        </label>
        <div className="categories">
          {CATEGORIES.map(([id, key]) => (
            <button
              key={id}
              className={category === id ? "active" : ""}
              onClick={() => setCategory(id)}
            >
              {tr(key)}
            </button>
          ))}
        </div>
      </div>
      <div className="catalog-meta">
        <span>
          {filtered.length} {tr("productsWord")}
        </span>
        <span className="catalog-updated">
          {tr("catalogUpdated")} {updatedAt}
        </span>
        <label className="brand-select">
          <span>{tr("brandFilter")}</span>
          <select
            value={brand}
            onChange={(event) => {
              setBrand(event.target.value);
              track("catalog_filter", {
                locale,
                filter: "brand",
                value: event.target.value,
              });
            }}
          >
            <option value="all">{tr("allBrands")}</option>
            {brands.map((option) => (
              <option key={option} value={option}>
                {option}
              </option>
            ))}
          </select>
        </label>
        {RESERVAS_ENABLED && (
          <label className="sort-select">
            {tr("sortLabel")}
            <select
              value={sort}
              onChange={(event) => setSort(event.target.value as SortMode)}
            >
              {availableSorts.map(([id, key]) => (
                <option key={id} value={id}>
                  {tr(key)}
                </option>
              ))}
            </select>
          </label>
        )}
      </div>
      <div className="product-grid catalog-grid">
        {loading
          ? Array.from({ length: 8 }, (_, i) => <ProductCardSkeleton key={i} />)
          : filtered.map((product) => (
              <ProductCard key={product.id} product={product} />
            ))}
      </div>
      {!loading && !filtered.length && (
        <div className="empty">
          <Search />
          <h2>{tr("noResults")}</h2>
        </div>
      )}
    </div>
  );
}
