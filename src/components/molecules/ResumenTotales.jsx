import { formatearPrecio } from '../../utils/formato'

function ResumenTotales({ neto, iva, total }) {
  return (
    <div className="cart-totals">
      <p>Subtotal Neto: <span>{formatearPrecio(neto)} CLP</span></p>
      <p>19% IVA: <span>{formatearPrecio(iva)} CLP</span></p>
      <h3>Total a Pagar: <span>{formatearPrecio(total)} CLP</span></h3>
    </div>
  )
}

export default ResumenTotales
