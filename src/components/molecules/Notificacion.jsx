import Alert from 'react-bootstrap/Alert'

// Mensaje de éxito (success) o de error (danger).
function Notificacion({ tipo = 'success', children }) {
  return (
    <Alert variant={tipo} transition={false}>
      {children}
    </Alert>
  )
}

export default Notificacion
