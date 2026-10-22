import Layout from '../components/organisms/Layout'
import FormularioLogin from '../components/organisms/FormularioLogin'

function Login() {
  return (
    <Layout subtitulo="Portal Clientes y Contratistas" textoPie="Portal Privado.">
      <main className="container login-container">
        <section className="card login-card">
          <h2>Portal Contratistas</h2>
          <p>Consulte el saldo de su Cuenta Corriente e historial de compras.</p>
          <FormularioLogin />
        </section>
      </main>
    </Layout>
  )
}

export default Login
