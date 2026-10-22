import Layout from '../components/organisms/Layout'
import BotonEnlace from '../components/atoms/BotonEnlace'

function NoEncontrada() {
  return (
    <Layout>
      <main className="container">
        <section className="card">
          <h2>Página no encontrada</h2>
          <p>La dirección que buscas no existe.</p>
          <BotonEnlace to="/" variante="volver">&larr; Volver al inicio</BotonEnlace>
        </section>
      </main>
    </Layout>
  )
}

export default NoEncontrada
