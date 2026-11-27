import api from './api'

// Checkout: la API descuenta el stock y registra las ventas. Requiere el token de un cliente.
// Devuelve el comprobante: { numeroPedido, fecha, total, tipoEntrega, metodoPago, direccionEntrega, lineas }.
class PedidoService {
  confirmar(pedido) {
    return api.post('/pedidos', pedido).then((respuesta) => respuesta.data)
  }
}

export default new PedidoService()
