import { useNavigate } from 'react-router-dom'
import Header from './Header'
import Footer from './Footer'
import { construirMenu } from '../../utils/menu'
import { obtenerSesion, cerrarSesion } from '../../utils/sesion'
import { obtenerCarrito, contarUnidades } from '../../utils/carrito'

// Marco común de todas las páginas: encabezado + contenido + pie.
// Cada página define su propio <main> (las clases varían: container, pos-layout, etc.).
// La sesión y el carrito se leen de localStorage; al cambiar de ruta la página se vuelve a dibujar
// y el menú se actualiza.
function Layout({ subtitulo = 'La Serena, Región de Coquimbo • Desde 2004', textoPie, children }) {
  const navigate = useNavigate()
  const sesion = obtenerSesion()

  const manejarCerrarSesion = () => {
    cerrarSesion()
    navigate('/login')
  }

  const itemsMenu = construirMenu(sesion, manejarCerrarSesion, contarUnidades(obtenerCarrito()))

  return (
    <>
      <Header titulo="Ferretería Los Maestros" subtitulo={subtitulo} itemsMenu={itemsMenu} />
      {children}
      <Footer texto={textoPie} />
    </>
  )
}

export default Layout
