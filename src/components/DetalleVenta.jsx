import { formatearPrecio } from '../utils/formato'

const IVA = 1.19

function DetalleVenta({ carrito, tipoCliente, onTipoClienteChange }) {
  const total = carrito.reduce((suma, item) => suma + item.precio * item.cantidad, 0)
  const neto = Math.round(total / IVA)
  const iva = total - neto

  return (
    <section className="card pos-cart">
      <h2>Detalle de Venta</h2>

      <div className="form-group">
        <label htmlFor="client-type">Tipo de Cliente:</label>
        <select
          id="client-type"
          value={tipoCliente}
          onChange={(e) => onTipoClienteChange(e.target.value)}
        >
          <option value="particular">Cliente Particular (Efectivo/Tarjeta)</option>
          <option value="contratista">Contratista (Cuenta Corriente)</option>
        </select>
      </div>

      <div className="cart-items">
        {carrito.length === 0 ? (
          <p className="carrito-vacio">No hay productos en la venta.</p>
        ) : (
          carrito.map((item) => (
            <div className="cart-item" key={item.id}>
              <span>{`${item.nombre} x ${item.cantidad}`}</span>
              <strong>{formatearPrecio(item.precio * item.cantidad)}</strong>
            </div>
          ))
        )}
      </div>

      <div className="cart-totals">
        <p>Subtotal Neto: <span>{formatearPrecio(neto)} CLP</span></p>
        <p>19% IVA: <span>{formatearPrecio(iva)} CLP</span></p>
        <h3>Total a Pagar: <span>{formatearPrecio(total)} CLP</span></h3>
      </div>

      <button type="button" className="btn btn-primary btn-block">
        Confirmar y Registrar Venta
      </button>
    </section>
  )
}

export default DetalleVenta
