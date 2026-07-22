import { lazy, Suspense } from "react";
import { Navigate, Outlet, Route, Routes, useParams } from "react-router-dom";
import Analytics from "./components/Analytics";
import BackToTop from "./components/BackToTop";
import Chat from "./components/Chat";
import Footer from "./components/Footer";
import Header from "./components/Header";
import ScrollManager from "./components/ScrollManager";
import Seo from "./components/Seo";
import { RESERVAS_ENABLED } from "./config";
import { AppProvider } from "./context/AppContext";
import Home from "./pages/Home";
import NotFound from "./pages/NotFound";
import { useLocale } from "./context/AppContext";

const Admin = lazy(() => import("./pages/Admin"));
const CartPage = lazy(() => import("./pages/CartPage"));
const Catalog = lazy(() => import("./pages/Catalog"));
const Checkout = lazy(() => import("./pages/Checkout"));
const Confirmation = lazy(() => import("./pages/Confirmation"));
const Legal = lazy(() => import("./pages/Legal"));
const Lookup = lazy(() => import("./pages/Lookup"));
const ProductDetail = lazy(() => import("./pages/ProductDetail"));

export default function App() {
  return (
    <AppProvider>
      <AppShell />
    </AppProvider>
  );
}

function AppShell() {
  return (
    <div className="app">
      <ScrollManager />
      <Analytics />
      <Seo />
      <Header />
      <main>
        <Suspense fallback={<PageLoader />}>
          <Routes>
            <Route path="/" element={<RootRedirect />} />
            <Route
              path="/catalogo"
              element={<LegacyRedirect target="/catalogo" />}
            />
            <Route
              path="/legales"
              element={<LegacyRedirect target="/legales" />}
            />
            <Route path="/producto/:id" element={<LegacyProductRedirect />} />
            <Route path="/:lang" element={<LanguageLayout />}>
              <Route index element={<Home />} />
              <Route path="catalogo" element={<Catalog />} />
              <Route path="producto/:id" element={<ProductDetail />} />
              <Route path="legales" element={<Legal />} />
              <Route path="equipo" element={<Admin />} />
              {/* Circuito de reserva: permanece oculto mientras RESERVAS_ENABLED sea false. */}
              <Route
                path="seleccion"
                element={RESERVAS_ENABLED ? <CartPage /> : <RootRedirect />}
              />
              <Route
                path="checkout"
                element={RESERVAS_ENABLED ? <Checkout /> : <RootRedirect />}
              />
              <Route
                path="confirmacion"
                element={RESERVAS_ENABLED ? <Confirmation /> : <RootRedirect />}
              />
              <Route
                path="mi-reserva"
                element={RESERVAS_ENABLED ? <Lookup /> : <RootRedirect />}
              />
            </Route>
            <Route path="*" element={<NotFound />} />
          </Routes>
        </Suspense>
      </main>
      <Footer />
      <Chat />
      <BackToTop />
    </div>
  );
}

function PageLoader() {
  const { tr } = useLocale();
  return (
    <div className="page page-loader" role="status">
      <span className="page-loader-mark" aria-hidden="true" />
      <p>{tr("loading")}</p>
    </div>
  );
}

function LanguageLayout() {
  const { lang } = useParams();
  if (!["es", "pt", "en"].includes(lang ?? "")) return <NotFound />;
  return <Outlet />;
}

function RootRedirect() {
  const { path } = useLocale();
  return <Navigate to={path("/")} replace />;
}

function LegacyRedirect({ target }: { target: string }) {
  const { path } = useLocale();
  return <Navigate to={path(target)} replace />;
}

function LegacyProductRedirect() {
  const { id } = useParams();
  return <LegacyRedirect target={`/producto/${id ?? ""}`} />;
}
