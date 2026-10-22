import { useState } from 'react'
import Layout from '../components/organisms/Layout'
import ListaCarrito from '../components/organisms/ListaCarrito'
import ResumenCompra from '../components/organisms/ResumenCompra'
import PedidoConfirmado from '../components/organisms/PedidoConfirmado'
import BotonEnlace from '../components/atoms/BotonEnlace'
import { construirLineas, calcularTotalLineas, desglosarTotal } from '../utils/carrito'

function Carrito({ productos, carrito, onCambiarCantidad, onQuitar, onConfirmarCompra }) {
  const [pedido, setPedido] = useState(null)

  const lineas = construirLineas(carrito, productos)
  const { neto, iva, total } = desglosarTotal(calcularTotalLineas(lineas))

  const confirmarCompra = (datos) => {
    // Se guarda el resumen antes de vaciar el carrito.
    setPedido({
      numero: `PED-${String(Date.now()).slice(-6)}`,
      lineas,
      total,
      tipoEntrega: datos.tipoEntrega,
      direccion: `${datos.direccion}, ${datos.comuna}`,
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
        <ResumenCompra neto={neto} iva={iva} total={total} onConfirmar={confirmarCompra} />
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
