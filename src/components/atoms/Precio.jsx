import { createElement } from 'react'
import { formatearPrecio } from '../../utils/formato'

// "as" permite usarlo como <p> (tarjeta) o <span> (detalle) sin cambiar el CSS.
function Precio({ valor, as = 'p', className = 'price' }) {
  return createElement(as, { className }, `${formatearPrecio(valor)} CLP`)
}

export default Precio
