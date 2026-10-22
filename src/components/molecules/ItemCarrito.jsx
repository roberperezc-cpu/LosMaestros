import { formatearPrecio } from '../../utils/formato'

function ItemCarrito({ item }) {
  return (
    <div className="cart-item">
      <span>{`${item.nombre} x ${item.cantidad}`}</span>
      <strong>{formatearPrecio(item.precio * item.cantidad)}</strong>
    </div>
  )
}

export default ItemCarrito
