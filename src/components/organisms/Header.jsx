import MarcaTienda from '../atoms/MarcaTienda'
import MenuPrincipal from '../molecules/MenuPrincipal'

function Header({ titulo, subtitulo, itemsMenu }) {
  return (
    <header className="main-header">
      <div className="header-container">
        <MarcaTienda titulo={titulo} subtitulo={subtitulo} />
        <MenuPrincipal items={itemsMenu} />
      </div>
    </header>
  )
}

export default Header
