import { useLocale } from '../context/AppContext'
import { legalSections } from '../i18n'

export default function Legal() {
  const { locale, tr } = useLocale()
  return (
    <div className="page legal">
      <span className="kicker">{tr('legalKicker')}</span>
      <h1>{tr('legalTitle')}</h1>
      {legalSections[locale].map(section => (
        <section key={section.title}>
          <h2>{section.title}</h2>
          <p>{section.body}</p>
        </section>
      ))}
    </div>
  )
}
