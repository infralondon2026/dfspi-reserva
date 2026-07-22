import { Link } from 'react-router-dom'
import { Clock3, Facebook, Instagram, Mail, MapPin, Phone } from 'lucide-react'
import { footerLogo, mapsUrl, storeAddress, storeCity, storeEmail, storePhone } from '../assets'
import { RESERVAS_ENABLED } from '../config'
import { useLocale } from '../context/AppContext'
import { socials } from '../siteContent'

const SOCIAL_ICON = { instagram: Instagram, facebook: Facebook }

export default function Footer() {
  const { tr, path } = useLocale()
  return (
    <footer>
      <div className="footer-main">
        <div className="footer-brand">
          <img src={footerLogo} alt="Duty Free Shop Puerto Iguazú" />
          <p>{tr('footerBody')}</p>
        </div>
        <div>
          <h4>{tr('store')}</h4>
          <Link to={path('/catalogo')}>{tr('navCatalog')}</Link>
          <Link to={path('/#ofertas')}>{tr('navOffers')}</Link>
          <Link to={path('/#mapa')}>{tr('navStore')}</Link>
          {RESERVAS_ENABLED && <Link to={path('/mi-reserva')}>{tr('navReservation')}</Link>}
        </div>
        <div>
          <h4>{tr('help')}</h4>
          <Link to={path('/#faq')}>FAQs</Link>
          <Link to={path('/legales')}>{tr('conditions')}</Link>
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
          {socials.length > 0 && (
            <div className="footer-social">
              <span>{tr('socialFollow')}</span>
              <div className="footer-social-links">
                {socials.map(social => {
                  const Icon = SOCIAL_ICON[social.icon]
                  return (
                    <a
                      key={social.name}
                      href={social.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      aria-label={social.name}
                    >
                      <Icon size={18} />
                    </a>
                  )
                })}
              </div>
            </div>
          )}
        </div>
      </div>
      <div className="footer-bottom">
        <span>© {new Date().getFullYear()} DFSPI · {tr('rights')}</span>
        <Link to={path('/equipo')}>{tr('admin')}</Link>
        <a href="https://londonsupplygroup.com" target="_blank" rel="noreferrer">
          {tr('companyOf')} <b>London Supply Group</b>
        </a>
      </div>
    </footer>
  )
}
