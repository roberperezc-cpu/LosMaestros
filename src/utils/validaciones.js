const REGEX_CORREO = /^[^\s@]+@[^\s@]+\.[^\s@]+$/

// Cada validador devuelve un mensaje de error, o '' si el valor es válido.
export function validarCorreo(valor = '') {
  if (!valor.trim()) return 'El correo es obligatorio.'
  if (!REGEX_CORREO.test(valor.trim())) return 'Ingresa un correo válido (ej: nombre@dominio.cl).'
  return ''
}

export function validarPassword(valor = '') {
  if (!valor) return 'La contraseña es obligatoria.'
  if (valor.length < 6) return 'La contraseña debe tener al menos 6 caracteres.'
  return ''
}

// Devuelve un objeto con un mensaje por cada campo inválido ({} si todo está bien).
export function validarLogin({ correo, password }) {
  const errores = {}

  const errorCorreo = validarCorreo(correo)
  if (errorCorreo) errores.correo = errorCorreo

  const errorPassword = validarPassword(password)
  if (errorPassword) errores.password = errorPassword

  return errores
}
