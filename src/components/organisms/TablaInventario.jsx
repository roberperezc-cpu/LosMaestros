import Boton from '../atoms/Boton'
import BotonEnlace from '../atoms/BotonEnlace'
import { formatearPrecio } from '../../utils/formato'
import { obtenerEstadoStock } from '../../utils/stock'

function TablaInventario({ productos, onEliminar = () => {} }) {
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
            <th>Acciones</th>
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
              <td className="acciones-fila">
                <BotonEnlace to={`/admin/productos/${p.id}/editar`} variante="accion">Editar</BotonEnlace>
                <Boton variante="pequeno" onClick={() => onEliminar(p)}>Eliminar</Boton>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </section>
  )
}

export default TablaInventario
