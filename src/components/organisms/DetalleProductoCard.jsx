import Precio from '../atoms/Precio'
import BotonEnlace from '../atoms/BotonEnlace'
import Boton from '../atoms/Boton'
import CajaStock from '../molecules/CajaStock'
import ListaEspecificaciones from '../molecules/ListaEspecificaciones'

function DetalleProductoCard({ producto, onAgregarAlCarrito }) {
  return (
    <section className="product-detail-card" id="product-detail-container">
      <div className="detail-gallery">
        <img src={producto.imagen} alt={producto.nombre} />
      </div>

      <div className="detail-content">
        <span className="category">{producto.categoriaNombre}</span>
        <h2>{producto.nombre}</h2>
        <p className="sku">SKU: {producto.id}</p>

        <div className="price-box">
          <Precio valor={producto.precio} as="span" />
          <span className="tax-info">IVA incluido</span>
        </div>

        <CajaStock producto={producto} />
        <ListaEspecificaciones especificaciones={producto.especificaciones} />

        <div className="detail-actions">
          {onAgregarAlCarrito && (
            <Boton
              bloque
              disabled={producto.stock === 0}
              onClick={() => onAgregarAlCarrito(producto)}
            >
              {producto.stock === 0 ? 'Sin stock' : 'Agregar al carrito'}
            </Boton>
          )}
          <p className="notice">
            * Para reservar stock o cargar a su Cuenta Corriente, inicie sesión como Contratista.
          </p>
          <BotonEnlace to="/login" variante="primario">Iniciar Sesión para Reservar</BotonEnlace>
        </div>
      </div>
    </section>
  )
}

export default DetalleProductoCard
