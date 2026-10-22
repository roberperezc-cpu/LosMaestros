import Layout from '../components/organisms/Layout'
import PanelAlertas from '../components/organisms/PanelAlertas'
import FormularioProducto from '../components/organisms/FormularioProducto'
import TablaInventario from '../components/organisms/TablaInventario'
import TablaContratistas from '../components/organisms/TablaContratistas'
import contratistas from '../data/contratistas'

function Admin({ productos, onAgregarProducto }) {
  return (
    <Layout subtitulo="Panel de Control (Dueño)" textoPie="Panel Administrativo.">
      <main className="container">
        <h2>Gestión de Inventario y Cuentas Corrientes</h2>
        <PanelAlertas productos={productos} />
        <FormularioProducto productos={productos} onAgregarProducto={onAgregarProducto} />
        <TablaInventario productos={productos} />
        <TablaContratistas contratistas={contratistas} />
      </main>
    </Layout>
  )
}

export default Admin
