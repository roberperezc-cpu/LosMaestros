import TarjetaProducto from '../molecules/TarjetaProducto'

function GrillaProductos({ productos = [], onAgregarAlCarrito }) {
  return (
    <div className="product-grid" id="product-grid">
      {productos.length === 0 ? (
        <p className="catalogo-vacio">
          No se encontraron productos que coincidan con la búsqueda.
        </p>
      ) : (
        productos.map((producto) => (
          <TarjetaProducto
            key={producto.id}
            producto={producto}
            onAgregarAlCarrito={onAgregarAlCarrito}
          />
        ))
      )}
    </div>
  )
}

export default GrillaProductos
