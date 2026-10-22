import { useParams } from 'react-router-dom'
import Layout from '../components/organisms/Layout'
import DetalleProductoCard from '../components/organisms/DetalleProductoCard'
import BotonEnlace from '../components/atoms/BotonEnlace'

function DetalleProducto({ productos, onAgregarAlCarrito }) {
  const { id } = useParams()
  const producto = productos.find((p) => p.id === id)

  return (
    <Layout>
      <main className="container">
        {producto ? (
          <>
            <BotonEnlace to="/catalogo" variante="volver">&larr; Volver al catálogo</BotonEnlace>
            <DetalleProductoCard producto={producto} onAgregarAlCarrito={onAgregarAlCarrito} />
          </>
        ) : (
          <section className="card">
            <h2>Producto no encontrado</h2>
            <BotonEnlace to="/catalogo" variante="volver">&larr; Volver al catálogo</BotonEnlace>
          </section>
        )}
      </main>
    </Layout>
  )
}

export default DetalleProducto
