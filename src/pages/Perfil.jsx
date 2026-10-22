import Layout from '../components/organisms/Layout'
import DatosPerfil from '../components/organisms/DatosPerfil'
import { obtenerSesion } from '../utils/sesion'

// Solo se muestra con sesión iniciada (la ruta está protegida con RutaPrivada).
function Perfil() {
  const usuario = obtenerSesion()

  return (
    <Layout subtitulo="Portal Clientes y Contratistas" textoPie="Portal Privado.">
      <main className="container">
        <DatosPerfil usuario={usuario} />
      </main>
    </Layout>
  )
}

export default Perfil
