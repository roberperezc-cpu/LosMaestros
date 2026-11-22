// Convierte un error de Axios en un mensaje claro para mostrar al usuario.
export function mensajeDeError(error) {
  const respuesta = error && error.response

  // Sin respuesta: el servidor no contestó (apagado, dirección incorrecta o CORS).
  if (!respuesta) {
    return 'No se pudo conectar con el servidor. Revisa que el backend esté encendido.'
  }

  const { status, data } = respuesta

  if (status === 401) {
    return 'Tu sesión no es válida o venció. Inicia sesión de nuevo con una cuenta de administrador.'
  }
  if (status === 403) {
    return 'No tienes permisos para realizar esta acción.'
  }
  if (data && data.errores) {
    return Object.values(data.errores).join(' ') // errores de validación por campo
  }
  return (data && data.mensaje) || 'Ocurrió un error inesperado.'
}
