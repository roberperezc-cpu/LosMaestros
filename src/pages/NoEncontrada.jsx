import { Link } from 'react-router-dom'
import Layout from '../components/Layout'

function NoEncontrada() {
  return (
    <Layout>
      <main className="container">
        <section className="card">
          <h2>Página no encontrada</h2>
          <p>La dirección que buscas no existe.</p>
          <Link to="/" className="btn-back">&larr; Volver al inicio</Link>
        </section>
      </main>
    </Layout>
  )
}

export default NoEncontrada
