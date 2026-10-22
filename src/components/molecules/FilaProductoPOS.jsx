import Boton from '../atoms/Boton'
import { formatearPrecio } from '../../utils/formato'

function FilaProductoPOS({ producto, onAgregar }) {
  return (
    <tr>
      <td>{producto.id}</td>
      <td>{producto.nombre}</td>
      <td>{formatearPrecio(producto.precio)}</td>
      <td>{producto.stock}</td>
      <td>
        <Boton variante="pequeno" onClick={() => onAgregar(producto)}>+ Agregar</Boton>
      </td>
    </tr>
  )
}

export default FilaProductoPOS
