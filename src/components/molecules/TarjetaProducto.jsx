import { Link } from 'react-router-dom'
import InsigniaStock from '../atoms/InsigniaStock'
import Precio from '../atoms/Precio'
import BotonEnlace from '../atoms/BotonEnlace'

function TarjetaProducto({ producto }) {
  const urlDetalle = `/catalogo/${producto.id}`
  const claseExtra = producto.stock === 0 ? 'btn-detalle-agotado' : ''

  return (
    <article className="product-card">
      <InsigniaStock producto={producto} />

      <Link to={urlDetalle}>
        <img src={producto.imagen} alt={producto.nombre} />
      </Link>

      <div className="product-info">
        <span className="category">{producto.categoriaNombre}</span>
        <h4>
          <Link to={urlDetalle} className="enlace-producto">{producto.nombre}</Link>
        </h4>
        <p className="sku">SKU: {producto.id}</p>
        <Precio valor={producto.precio} />
        <p className="stock-count">
          Disponible: <strong>{producto.stock} unidades</strong>
        </p>
        <BotonEnlace to={urlDetalle} variante="pequeno" className={claseExtra}>
          Ver Detalle
        </BotonEnlace>
      </div>
    </article>
  )
}

export default TarjetaProducto
