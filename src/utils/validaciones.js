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

// ---------- Producto (panel admin) ----------
const REGEX_SKU = /^[A-Z]{3}-[A-Z]{3}-\d{3}$/
const REGEX_ENTERO = /^\d+$/

function esEntero(valor) {
  return REGEX_ENTERO.test(String(valor).trim())
}

// Devuelve un objeto con un mensaje por campo inválido ({} si todo está bien).
// "productos" es el catálogo actual, para detectar SKU repetidos.
export function validarProducto(datos, productos = []) {
  const errores = {}
  const sku = datos.sku.trim().toUpperCase()

  if (!sku) {
    errores.sku = 'El SKU es obligatorio.'
  } else if (!REGEX_SKU.test(sku)) {
    errores.sku = 'Formato inválido. Usa AAA-AAA-000 (ej: HER-MAR-010).'
  } else if (productos.some((p) => p.id === sku)) {
    errores.sku = 'Ya existe un producto con ese SKU.'
  }

  if (datos.nombre.trim().length < 3) {
    errores.nombre = 'El nombre debe tener al menos 3 caracteres.'
  }

  if (!datos.categoria) {
    errores.categoria = 'Selecciona una categoría.'
  }

  if (!esEntero(datos.precio) || Number(datos.precio) <= 0) {
    errores.precio = 'Ingresa un precio entero mayor a 0.'
  }

  if (!esEntero(datos.stock)) {
    errores.stock = 'El stock debe ser un número entero (0 o más).'
  }

  if (!esEntero(datos.stockMinimo)) {
    errores.stockMinimo = 'El stock mínimo debe ser un número entero (0 o más).'
  }

  if (!datos.ubicacion.trim()) {
    errores.ubicacion = 'La ubicación en bodega es obligatoria.'
  }

  return errores
}
