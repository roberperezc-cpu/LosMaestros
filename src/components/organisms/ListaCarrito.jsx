import LineaCarrito from '../molecules/LineaCarrito'

function ListaCarrito({ lineas, onCambiarCantidad, onQuitar }) {
  return (
    <section className="card">
      <h2>Tu Carrito</h2>
      {lineas.map((linea) => (
        <LineaCarrito
          key={linea.producto.id}
          linea={linea}
          onCambiarCantidad={onCambiarCantidad}
          onQuitar={onQuitar}
        />
      ))}
    </section>
  )
}

export default ListaCarrito
