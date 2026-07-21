import { Navigate, Route, Routes } from 'react-router-dom'
import BackToTop from './components/BackToTop'
import Chat from './components/Chat'
import Footer from './components/Footer'
import Header from './components/Header'
import ScrollManager from './components/ScrollManager'
import { RESERVAS_ENABLED } from './config'
import { AppProvider } from './context/AppContext'
import Admin from './pages/Admin'
import CartPage from './pages/CartPage'
import Catalog from './pages/Catalog'
import Checkout from './pages/Checkout'
import Confirmation from './pages/Confirmation'
import Home from './pages/Home'
import Legal from './pages/Legal'
import Lookup from './pages/Lookup'
import NotFound from './pages/NotFound'
import ProductDetail from './pages/ProductDetail'

export default function App() {
  return (
    <AppProvider>
      <div className="app">
        <ScrollManager />
        <Header />
        <main>
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/catalogo" element={<Catalog />} />
            <Route path="/producto/:id" element={<ProductDetail />} />
            <Route path="/legales" element={<Legal />} />
            <Route path="/equipo" element={<Admin />} />
            {/* Circuito de reserva: activo solo con RESERVAS_ENABLED; si no, redirige a inicio. */}
            <Route path="/seleccion" element={RESERVAS_ENABLED ? <CartPage /> : <Navigate to="/" replace />} />
            <Route path="/checkout" element={RESERVAS_ENABLED ? <Checkout /> : <Navigate to="/" replace />} />
            <Route
              path="/confirmacion"
              element={RESERVAS_ENABLED ? <Confirmation /> : <Navigate to="/" replace />}
            />
            <Route path="/mi-reserva" element={RESERVAS_ENABLED ? <Lookup /> : <Navigate to="/" replace />} />
            <Route path="*" element={<NotFound />} />
          </Routes>
        </main>
        <Footer />
        <Chat />
        <BackToTop />
      </div>
    </AppProvider>
  )
}
