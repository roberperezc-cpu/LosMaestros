import Boton from '../atoms/Boton'
import { formatearPrecio } from '../../utils/formato'

function LineaCarrito({ linea, onCambiarCantidad, onQuitar }) {
  const { producto, cantidad } = linea

  return (
    <article className="linea-carrito">
      <img src={producto.imagen} alt={producto.nombre} />

      <div>
        <h4>{producto.nombre}</h4>
        <p className="sku">SKU: {producto.id}</p>
        <p>{formatearPrecio(producto.precio)} c/u</p>
      </div>

      <div className="linea-carrito-acciones">
        <div className="control-cantidad">
          <Boton
            variante="pequeno"
            aria-label={`Disminuir cantidad de ${producto.nombre}`}
            onClick={() => onCambiarCantidad(producto.id, -1)}
          >
            −
          </Boton>
          <span>{cantidad}</span>
          <Boton
            variante="pequeno"
            aria-label={`Aumentar cantidad de ${producto.nombre}`}
            disabled={cantidad >= producto.stock}
            onClick={() => onCambiarCantidad(producto.id, 1)}
          >
            +
          </Boton>
        </div>

        <strong>{formatearPrecio(producto.precio * cantidad)}</strong>

        <Boton
          variante="pequeno"
          aria-label={`Quitar ${producto.nombre} del carrito`}
          onClick={() => onQuitar(producto.id)}
        >
          Quitar
        </Boton>
      </div>
    </article>
  )
}

export default LineaCarrito
