import { obtenerEstadoStock } from '../../utils/stock'

function InsigniaStock({ producto }) {
  const estado = obtenerEstadoStock(producto)

  return <div className={`badge ${estado.clase}`}>{estado.texto}</div>
}

export default InsigniaStock
