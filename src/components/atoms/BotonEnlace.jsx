import { Link } from 'react-router-dom'

const VARIANTES = {
  primario: 'btn btn-primary',
  secundario: 'btn btn-secondary',
  pequeno: 'btn-sm btn-detalle',
  volver: 'btn-back',
  servicio: 'service-link',
}

function BotonEnlace({ to, variante = 'primario', className = '', children }) {
  const clases = [VARIANTES[variante], className].filter(Boolean).join(' ')

  return (
    <Link to={to} className={clases}>
      {children}
    </Link>
  )
}

export default BotonEnlace
