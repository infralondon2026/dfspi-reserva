import { Route, Routes } from 'react-router-dom'
import BackToTop from './components/BackToTop'
import Chat from './components/Chat'
import Footer from './components/Footer'
import Header from './components/Header'
import ScrollManager from './components/ScrollManager'
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
            <Route path="/seleccion" element={<CartPage />} />
            <Route path="/checkout" element={<Checkout />} />
            <Route path="/confirmacion" element={<Confirmation />} />
            <Route path="/mi-reserva" element={<Lookup />} />
            <Route path="/legales" element={<Legal />} />
            <Route path="/equipo" element={<Admin />} />
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
