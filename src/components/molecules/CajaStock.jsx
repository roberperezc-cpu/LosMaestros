function claseCaja(producto) {
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

function CajaStock({ producto }) {
  return (
    <div className={claseCaja(producto)}>
      <div>
        <strong>{textoStock(producto)}</strong>
        <p>Ubicación en Bodega: {producto.ubicacion}</p>
      </div>
    </div>
  )
}

export default CajaStock
