import { formatearPrecio } from '../utils/formato'

function TablaProductosPOS({ productos, onAgregar }) {
  return (
    <table className="table">
      <thead>
        <tr>
          <th>SKU</th>
          <th>Producto</th>
          <th>Precio</th>
          <th>Stock</th>
          <th>Acción</th>
        </tr>
      </thead>
      <tbody>
        {productos.map((prod) => (
          <tr key={prod.id}>
            <td>{prod.id}</td>
            <td>{prod.nombre}</td>
            <td>{formatearPrecio(prod.precio)}</td>
            <td>{prod.stock}</td>
            <td>
              <button type="button" className="btn-sm" onClick={() => onAgregar(prod)}>
                + Agregar
              </button>
            </td>
          </tr>
        ))}
      </tbody>
    </table>
  )
}

export default TablaProductosPOS
