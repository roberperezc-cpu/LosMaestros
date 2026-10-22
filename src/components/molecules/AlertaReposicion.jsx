function AlertaReposicion({ producto }) {
  return (
    <li>
      <strong>{producto.nombre} (SKU: {producto.id})</strong>: Quedan {producto.stock} unidades
      {producto.stock === 0 ? ' (Agotado).' : ` (Mínimo recomendado: ${producto.stockMinimo}).`}
    </li>
  )
}

export default AlertaReposicion
