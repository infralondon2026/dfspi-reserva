import { Link } from 'react-router-dom'
import { Clock3, Mail, MapPin, Phone } from 'lucide-react'
import { logo, mapsUrl, storeAddress, storeCity, storeEmail, storePhone } from '../assets'
import { useLocale } from '../context/AppContext'

export default function Footer() {
  const { tr } = useLocale()
  return (
    <footer>
      <div className="footer-main">
        <div className="footer-brand">
          <img src={logo} alt="Duty Free Shop Puerto Iguazú" />
          <p>{tr('footerBody')}</p>
        </div>
        <div>
          <h4>{tr('store')}</h4>
          <Link to="/catalogo">{tr('navCatalog')}</Link>
          <Link to="/mi-reserva">{tr('navReservation')}</Link>
          <Link to="/#como">{tr('navHow')}</Link>
        </div>
        <div>
          <h4>{tr('help')}</h4>
          <Link to="/#faq">FAQs</Link>
          <Link to="/legales">{tr('conditions')}</Link>
          <a href={`mailto:${storeEmail}`}>{tr('contact')}</a>
        </div>
        <div>
          <h4>{tr('visitUs')}</h4>
          <p className="footer-contact">
            <MapPin size={15} /> <a href={mapsUrl} target="_blank" rel="noreferrer">{storeAddress}<br />{storeCity}</a>
          </p>
          <p className="footer-contact">
            <Clock3 size={15} /> {tr('hours')}
          </p>
          <p className="footer-contact">
            <Phone size={15} /> <a href={`tel:${storePhone.replace(/\s/g, '')}`}>{storePhone}</a>
          </p>
          <p className="footer-contact">
            <Mail size={15} /> <a href={`mailto:${storeEmail}`}>{storeEmail}</a>
          </p>
        </div>
      </div>
      <div className="footer-bottom">
        <span>© {new Date().getFullYear()} DFSPI · {tr('rights')}</span>
        <Link to="/equipo">{tr('admin')}</Link>
        <a href="https://londonsupplygroup.com" target="_blank" rel="noreferrer">
          {tr('companyOf')} <b>London Supply Group</b>
        </a>
      </div>
    </footer>
  )
}
