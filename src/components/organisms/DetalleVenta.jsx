import CampoFormulario from '../molecules/CampoFormulario'
import Selector from '../atoms/Selector'
import Boton from '../atoms/Boton'
import ItemCarrito from '../molecules/ItemCarrito'
import ResumenTotales from '../molecules/ResumenTotales'

const IVA = 1.19

function DetalleVenta({ carrito, tipoCliente, onTipoClienteChange }) {
  const total = carrito.reduce((suma, item) => suma + item.precio * item.cantidad, 0)
  const neto = Math.round(total / IVA)
  const iva = total - neto

  return (
    <section className="card pos-cart">
      <h2>Detalle de Venta</h2>

      <CampoFormulario id="client-type" label="Tipo de Cliente:">
        <Selector
          id="client-type"
          value={tipoCliente}
          onChange={(e) => onTipoClienteChange(e.target.value)}
        >
          <option value="particular">Cliente Particular (Efectivo/Tarjeta)</option>
          <option value="contratista">Contratista (Cuenta Corriente)</option>
        </Selector>
      </CampoFormulario>

      <div className="cart-items">
        {carrito.length === 0 ? (
          <p className="carrito-vacio">No hay productos en la venta.</p>
        ) : (
          carrito.map((item) => <ItemCarrito key={item.id} item={item} />)
        )}
      </div>

      <ResumenTotales neto={neto} iva={iva} total={total} />

      <Boton bloque>Confirmar y Registrar Venta</Boton>
    </section>
  )
}

export default DetalleVenta
