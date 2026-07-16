import { useEffect } from 'react'
import { useLocation } from 'react-router-dom'

/**
 * Restores the expected scrolling behavior of a classic website:
 * jump to top on route change, or smooth-scroll to the anchor when
 * the navigation carries a #hash (e.g. /#como, /#faq).
 */
export default function ScrollManager() {
  const { pathname, hash } = useLocation()

  useEffect(() => {
    if (hash) {
      const target = document.getElementById(hash.slice(1))
      if (target) {
        target.scrollIntoView({ behavior: 'smooth', block: 'start' })
        return
      }
    }
    window.scrollTo({ top: 0 })
  }, [pathname, hash])

  return null
}
