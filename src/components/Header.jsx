import { NavLink } from 'react-router-dom'

function Header({ titulo, subtitulo, itemsMenu }) {
  return (
    <header className="main-header">
      <div className="header-container">
        <div className="brand">
          <h1>{titulo}</h1>
          <p className="tagline">{subtitulo}</p>
        </div>

        <nav className="main-nav">
          <ul>
            {itemsMenu.map((item) => (
              <li key={item.to}>
                <NavLink
                  to={item.to}
                  end={item.to === '/'}
                  className={({ isActive }) =>
                    [item.className, isActive ? 'active' : ''].filter(Boolean).join(' ')
                  }
                >
                  {item.label}
                </NavLink>
              </li>
            ))}
          </ul>
        </nav>
      </div>
    </header>
  )
}

export default Header
