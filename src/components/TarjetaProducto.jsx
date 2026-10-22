import { Link } from 'react-router-dom'
import { obtenerEstadoStock } from '../utils/stock'
import { formatearPrecio } from '../utils/formato'

function TarjetaProducto({ producto }) {
  const estado = obtenerEstadoStock(producto)
  const urlDetalle = `/catalogo/${producto.id}`
  const claseBoton = `btn-sm btn-detalle${producto.stock === 0 ? ' btn-detalle-agotado' : ''}`

  return (
    <article className="product-card">
      <div className={`badge ${estado.clase}`}>{estado.texto}</div>

      <Link to={urlDetalle}>
        <img src={producto.imagen} alt={producto.nombre} />
      </Link>

      <div className="product-info">
        <span className="category">{producto.categoriaNombre}</span>
        <h4>
          <Link to={urlDetalle} className="enlace-producto">{producto.nombre}</Link>
        </h4>
        <p className="sku">SKU: {producto.id}</p>
        <p className="price">{formatearPrecio(producto.precio)} CLP</p>
        <p className="stock-count">
          Disponible: <strong>{producto.stock} unidades</strong>
        </p>
        <Link to={urlDetalle} className={claseBoton}>Ver Detalle</Link>
      </div>
    </article>
  )
}

export default TarjetaProducto
