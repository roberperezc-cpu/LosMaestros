import BotonEnlace from '../atoms/BotonEnlace'
import { formatearPrecio } from '../../utils/formato'

function PedidoConfirmado({ pedido }) {
  const textoEntrega =
    pedido.tipoEntrega === 'despacho'
      ? `Despacho a domicilio: ${pedido.direccion}.`
      : 'Retiro en tienda: Av. Principal #1234, La Serena.'

  return (
    <section className="card">
      <h2>Compra confirmada</h2>
      <p>
        Tu pedido <strong>{pedido.numero}</strong> fue registrado correctamente.
      </p>

      <div className="specs-section">
        <h3>Detalle del pedido</h3>
        <ul>
          {pedido.lineas.map((linea) => (
            <li key={linea.producto.id}>{`${linea.producto.nombre} x ${linea.cantidad}`}</li>
          ))}
        </ul>
        <p>
          Total pagado: <strong>{formatearPrecio(pedido.total)} CLP</strong>
        </p>
        <p>{textoEntrega}</p>
      </div>

      <BotonEnlace to="/catalogo" variante="primario">Seguir comprando</BotonEnlace>
    </section>
  )
}

export default PedidoConfirmado
