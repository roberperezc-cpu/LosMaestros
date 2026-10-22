import { Link, useParams } from 'react-router-dom'
import Layout from '../components/Layout'
import productos from '../data/productos'
import { formatearPrecio } from '../utils/formato'

function claseCajaStock(producto) {
  if (producto.stock === 0) return 'stock-status-box stock-out-box'
  if (producto.stock <= producto.stockMinimo) return 'stock-status-box stock-low-box'
  return 'stock-status-box stock-ok-box'
}

function textoStock(producto) {
  if (producto.stock === 0) return 'Agotado - Sin stock disponible'
  if (producto.stock <= producto.stockMinimo) {
    return `Stock Disponible: ${producto.stock} unidades (Bajo Stock)`
  }
  return `Stock Disponible: ${producto.stock} unidades en bodega`
}

function DetalleProducto() {
  const { id } = useParams()
  const producto = productos.find((p) => p.id === id)

  if (!producto) {
    return (
      <Layout>
        <main className="container">
          <section className="card">
            <h2>Producto no encontrado</h2>
            <Link to="/catalogo" className="btn-back">&larr; Volver al catálogo</Link>
          </section>
        </main>
      </Layout>
    )
  }

  return (
    <Layout>
      <main className="container">
        <Link to="/catalogo" className="btn-back">&larr; Volver al catálogo</Link>

        <section className="product-detail-card" id="product-detail-container">
          <div className="detail-gallery">
            <img src={producto.imagen} alt={producto.nombre} />
          </div>

          <div className="detail-content">
            <span className="category">{producto.categoriaNombre}</span>
            <h2>{producto.nombre}</h2>
            <p className="sku">SKU: {producto.id}</p>

            <div className="price-box">
              <span className="price">{formatearPrecio(producto.precio)} CLP</span>
              <span className="tax-info">IVA incluido</span>
            </div>

            <div className={claseCajaStock(producto)}>
              <div>
                <strong>{textoStock(producto)}</strong>
                <p>Ubicación en Bodega: {producto.ubicacion}</p>
              </div>
            </div>

            <div className="specs-section">
              <h3>Especificaciones Técnicas</h3>
              <ul>
                {Object.entries(producto.especificaciones).map(([clave, valor]) => (
                  <li key={clave}><strong>{clave}:</strong> {valor}</li>
                ))}
              </ul>
            </div>

            <div className="detail-actions">
              <p className="notice">
                * Para reservar stock o cargar a su Cuenta Corriente, inicie sesión como Contratista.
              </p>
              <Link to="/login" className="btn btn-primary">Iniciar Sesión para Reservar</Link>
            </div>
          </div>
        </section>
      </main>
    </Layout>
  )
}

export default DetalleProducto
