import { Link } from 'react-router-dom'
import { CircleHelp } from 'lucide-react'
import { useLocale } from '../context/AppContext'

export default function NotFound() {
  const { tr, path } = useLocale()
  return (
    <div className="page empty">
      <CircleHelp />
      <h1>{tr('pageNotFound')}</h1>
      <Link to={path('/')} className="button navy">
        {tr('backHome')}
      </Link>
    </div>
  )
}
