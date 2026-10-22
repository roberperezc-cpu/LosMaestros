import { Link, useNavigate } from 'react-router-dom'
import Layout from '../components/organisms/Layout'
import FormularioRegistro from '../components/organisms/FormularioRegistro'

function Registro() {
  const navigate = useNavigate()

  return (
    <Layout subtitulo="Creación de cuenta" textoPie="Portal Privado.">
      <main className="container">
        <section className="card registro-card">
          <h2>Crear Cuenta</h2>
          <p>Regístrate para acceder al portal de clientes y contratistas.</p>
          <FormularioRegistro onRegistroExitoso={() => navigate('/perfil')} />
          <p className="notice">
            ¿Ya tienes cuenta? <Link to="/login">Inicia sesión</Link>
          </p>
        </section>
      </main>
    </Layout>
  )
}

export default Registro
