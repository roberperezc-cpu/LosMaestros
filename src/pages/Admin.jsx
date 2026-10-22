import Layout from '../components/organisms/Layout'
import PanelAlertas from '../components/organisms/PanelAlertas'
import TablaContratistas from '../components/organisms/TablaContratistas'
import contratistas from '../data/contratistas'

function Admin({ productos }) {
  return (
    <Layout subtitulo="Panel de Control (Dueño)" textoPie="Panel Administrativo.">
      <main className="container">
        <h2>Gestión de Inventario y Cuentas Corrientes</h2>
        <PanelAlertas productos={productos} />
        <TablaContratistas contratistas={contratistas} />
      </main>
    </Layout>
  )
}

export default Admin
