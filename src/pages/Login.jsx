import { Link, useLocation, useNavigate } from 'react-router-dom'
import Layout from '../components/organisms/Layout'
import FormularioLogin from '../components/organisms/FormularioLogin'
import Notificacion from '../components/molecules/Notificacion'

function Login() {
  const navigate = useNavigate()
  const { search } = useLocation()

  // El cliente HTTP redirige aquí con ?expirada=1 cuando el token venció.
  const sesionExpirada = new URLSearchParams(search).get('expirada') === '1'

  // El administrador va a su panel; el contratista, al inicio.
  const manejarLoginExitoso = (usuario) => {
    navigate(usuario.rol === 'admin' ? '/admin' : '/')
  }

  return (
    <Layout subtitulo="Portal Clientes y Contratistas" textoPie="Portal Privado.">
      <main className="container login-container">
        <section className="card login-card">
          <h2>Portal Contratistas</h2>
          <p>Consulte el saldo de su Cuenta Corriente e historial de compras.</p>
          {sesionExpirada && (
            <Notificacion tipo="danger">Tu sesión expiró. Inicia sesión de nuevo para continuar.</Notificacion>
          )}
          <FormularioLogin onLoginExitoso={manejarLoginExitoso} />
          <p className="notice">
            ¿No tienes cuenta? <Link to="/registro">Regístrate aquí</Link>
          </p>
          <p className="notice">
            Usuarios de prueba: admin@losmaestros.cl / Admin123 · contratista@losmaestros.cl /
            Maestro123
          </p>
        </section>
      </main>
    </Layout>
  )
}

export default Login
