import { NavLink } from 'react-router-dom'

function EnlaceMenu({ to, label, className }) {
  return (
    <NavLink
      to={to}
      end={to === '/'}
      className={({ isActive }) => [className, isActive ? 'active' : ''].filter(Boolean).join(' ')}
    >
      {label}
    </NavLink>
  )
}

export default EnlaceMenu
