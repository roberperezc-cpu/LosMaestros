import Boton from '../atoms/Boton'
import { formatearPrecio } from '../../utils/formato'

function FilaContratista({ contratista }) {
  return (
    <tr>
      <td>{contratista.nombre}</td>
      <td>{contratista.rut}</td>
      <td>{contratista.comprasMes} compras</td>
      <td>{formatearPrecio(contratista.deuda)} CLP</td>
      <td><Boton variante="pequeno">Ver Historial</Boton></td>
    </tr>
  )
}

export default FilaContratista
