import { useNavigate } from 'react-router-dom'
import Layout from '../components/organisms/Layout'
import FormularioLogin from '../components/organisms/FormularioLogin'

function Login() {
  const navigate = useNavigate()

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
          <FormularioLogin onLoginExitoso={manejarLoginExitoso} />
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
