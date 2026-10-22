import AlertaReposicion from '../molecules/AlertaReposicion'
import { productosParaReponer } from '../../utils/stock'

// Las alertas salen del inventario (antes estaban escritas a mano en admin.html).
function PanelAlertas({ productos }) {
  const alertas = productosParaReponer(productos)

  return (
    <section className="card alert-card">
      <h3>⚠️ Alertas de Reposición de Stock</h3>
      <p>Los siguientes productos están por debajo del punto mínimo de reposición:</p>
      <ul className="alert-list">
        {alertas.map((producto) => (
          <AlertaReposicion key={producto.id} producto={producto} />
        ))}
      </ul>
    </section>
  )
}

export default PanelAlertas
