import { Navigate } from 'react-router-dom'
import { obtenerSesion } from '../utils/sesion'

// Protege una ruta: sin sesión -> /login; con sesión pero rol distinto -> inicio.
function RutaPrivada({ rolRequerido, children }) {
  const sesion = obtenerSesion()

  if (!sesion) return <Navigate to="/login" replace />
  if (rolRequerido && sesion.rol !== rolRequerido) return <Navigate to="/" replace />

  return children
}

export default RutaPrivada
