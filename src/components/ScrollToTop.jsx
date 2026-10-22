import { useEffect } from 'react'
import { useLocation } from 'react-router-dom'

// En una SPA el scroll no se reinicia solo al cambiar de página.
function ScrollToTop() {
  const { pathname } = useLocation()

  useEffect(() => {
    window.scrollTo(0, 0)
  }, [pathname])

  return null
}

export default ScrollToTop
