import { formatearPrecio } from '../../utils/formato'
import { obtenerEstadoStock } from '../../utils/stock'

function TablaInventario({ productos }) {
  return (
    <section className="card">
      <h3>Inventario Actual ({productos.length} productos)</h3>
      <table className="table">
        <thead>
          <tr>
            <th>SKU</th>
            <th>Producto</th>
            <th>Categoría</th>
            <th>Precio</th>
            <th>Stock</th>
            <th>Estado</th>
          </tr>
        </thead>
        <tbody>
          {productos.map((p) => (
            <tr key={p.id}>
              <td>{p.id}</td>
              <td>{p.nombre}</td>
              <td>{p.categoriaNombre}</td>
              <td>{formatearPrecio(p.precio)}</td>
              <td>{p.stock}</td>
              <td>{obtenerEstadoStock(p).texto}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </section>
  )
}

export default TablaInventario
