import Header from './Header'
import Footer from './Footer'
import itemsMenu from '../../data/menu'

// Marco común de todas las páginas: encabezado + contenido + pie.
// Cada página define su propio <main> (las clases varían: container, pos-layout, etc.).
function Layout({ subtitulo = 'La Serena, Región de Coquimbo • Desde 2004', textoPie, children }) {
  return (
    <>
      <Header titulo="Ferretería Los Maestros" subtitulo={subtitulo} itemsMenu={itemsMenu} />
      {children}
      <Footer texto={textoPie} />
    </>
  )
}

export default Layout
