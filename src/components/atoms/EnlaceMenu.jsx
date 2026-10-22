import { NavLink } from 'react-router-dom'

// Si recibe onClick (ej: "Cerrar sesión") ejecuta esa acción en vez de navegar.
function EnlaceMenu({ to, label, className, onClick }) {
  const manejarClick = onClick
    ? (event) => {
        event.preventDefault()
        onClick()
      }
    : undefined

  return (
    <NavLink
      to={to}
      end={to === '/'}
      onClick={manejarClick}
      className={({ isActive }) => [className, isActive ? 'active' : ''].filter(Boolean).join(' ')}
    >
      {label}
    </NavLink>
  )
}

export default EnlaceMenu
