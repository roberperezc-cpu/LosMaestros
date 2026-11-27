import { useState } from 'react'
import Layout from '../components/organisms/Layout'
import ListaCarrito from '../components/organisms/ListaCarrito'
import ResumenCompra from '../components/organisms/ResumenCompra'
import PedidoConfirmado from '../components/organisms/PedidoConfirmado'
import BotonEnlace from '../components/atoms/BotonEnlace'
import PedidoService from '../services/PedidoService'
import { construirLineas, calcularTotalLineas, desglosarTotal } from '../utils/carrito'
import { obtenerSesion } from '../utils/sesion'

function Carrito({ productos, carrito, onCambiarCantidad, onQuitar, onConfirmarCompra }) {
  const [pedido, setPedido] = useState(null)

  const sesion = obtenerSesion()
  const puedeComprar = Boolean(sesion && sesion.token)

  const lineas = construirLineas(carrito, productos)
  const { neto, iva, total } = desglosarTotal(calcularTotalLineas(lineas))

  // Envía la compra a la API (POST /api/pedidos). Si el servidor la rechaza, el error sube al
  // formulario, que lo muestra; solo si resulta se muestra el comprobante y se vacía el carrito.
  const confirmarCompra = async (datos) => {
    const comprobante = await PedidoService.confirmar({
      tipoEntrega: datos.tipoEntrega,
      metodoPago: datos.metodoPago,
      direccionEntrega: datos.tipoEntrega === 'despacho' ? `${datos.direccion.trim()}, ${datos.comuna}` : null,
      items: carrito.map((item) => ({ productoId: item.id, cantidad: item.cantidad })),
    })

    setPedido({
      numero: comprobante.numeroPedido,
      total: comprobante.total,
      tipoEntrega: comprobante.tipoEntrega,
      direccion: comprobante.direccionEntrega,
      lineas: comprobante.lineas.map((linea) => ({
        producto: { id: linea.productoId, nombre: linea.nombre },
        cantidad: linea.cantidad,
      })),
    })
    onConfirmarCompra()
  }

  let contenido
  if (pedido) {
    contenido = <PedidoConfirmado pedido={pedido} />
  } else if (lineas.length === 0) {
    contenido = (
      <section className="card">
        <h2>Tu Carrito</h2>
        <p>Tu carrito está vacío.</p>
        <BotonEnlace to="/catalogo" variante="primario">Ir al catálogo</BotonEnlace>
      </section>
    )
  } else {
    contenido = (
      <div className="carrito-layout">
        <ListaCarrito lineas={lineas} onCambiarCantidad={onCambiarCantidad} onQuitar={onQuitar} />
        <ResumenCompra
          neto={neto}
          iva={iva}
          total={total}
          puedeComprar={puedeComprar}
          onConfirmar={confirmarCompra}
        />
      </div>
    )
  }

  return (
    <Layout subtitulo="Resumen de compra" textoPie="Compra segura.">
      <main className="container">{contenido}</main>
    </Layout>
  )
}

export default Carrito
