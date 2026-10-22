// Estado de stock de un producto: clase CSS del badge y texto.
export function obtenerEstadoStock(producto) {
  if (producto.stock === 0) return { clase: 'stock-out', texto: 'Agotado' }
  if (producto.stock <= producto.stockMinimo) return { clase: 'stock-low', texto: 'Bajo Stock' }
  return { clase: 'stock-ok', texto: 'En Stock' }
}

// Productos en o bajo el punto mínimo de reposición (alertas del panel admin).
export function productosParaReponer(productos) {
  return productos.filter((p) => p.stock <= p.stockMinimo)
}
