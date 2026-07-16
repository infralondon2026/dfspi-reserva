import { ArrowUp } from 'lucide-react'
import { useLocale } from '../context/AppContext'
import { useScrolled } from '../hooks'

export default function BackToTop() {
  const { tr } = useLocale()
  const visible = useScrolled(600)
  if (!visible) return null
  return (
    <button
      className="back-to-top"
      onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
      aria-label={tr('backToTop')}
    >
      <ArrowUp size={18} />
    </button>
  )
}
