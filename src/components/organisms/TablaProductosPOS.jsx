import FilaProductoPOS from '../molecules/FilaProductoPOS'

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
          <FilaProductoPOS key={prod.id} producto={prod} onAgregar={onAgregar} />
        ))}
      </tbody>
    </table>
  )
}

export default TablaProductosPOS
