import Layout from '../components/organisms/Layout'
import Hero from '../components/organisms/Hero'
import GrillaServicios from '../components/organisms/GrillaServicios'
import SeccionInfoAtencion from '../components/organisms/SeccionInfoAtencion'
import servicios from '../data/servicios'
import infoAtencion from '../data/infoAtencion'

function Inicio() {
  return (
    <Layout>
      <main className="container">
        <Hero />
        <GrillaServicios servicios={servicios} />
        <SeccionInfoAtencion bloques={infoAtencion} />
      </main>
    </Layout>
  )
}

export default Inicio
