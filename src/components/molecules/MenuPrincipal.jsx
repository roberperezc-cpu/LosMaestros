import EnlaceMenu from '../atoms/EnlaceMenu'

function MenuPrincipal({ items }) {
  return (
    <nav className="main-nav">
      <ul>
        {items.map((item) => (
          <li key={item.to}>
            <EnlaceMenu to={item.to} label={item.label} className={item.className} />
          </li>
        ))}
      </ul>
    </nav>
  )
}

export default MenuPrincipal
