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

// ---------- Registro de usuario ----------
function calcularDigitoVerificador(cuerpo) {
  let suma = 0
  let factor = 2

  for (let i = cuerpo.length - 1; i >= 0; i--) {
    suma += Number(cuerpo[i]) * factor
    factor = factor === 7 ? 2 : factor + 1
  }

  const resto = 11 - (suma % 11)
  if (resto === 11) return '0'
  if (resto === 10) return 'K'
  return String(resto)
}

// Valida formato y dígito verificador (módulo 11). Acepta con o sin puntos y guion.
export function validarRut(valor = '') {
  const limpio = valor.replace(/[.\-\s]/g, '').toUpperCase()

  if (!limpio) return 'El RUT es obligatorio.'
  if (!/^\d{7,8}[0-9K]$/.test(limpio)) return 'Formato de RUT inválido (ej: 12.345.678-5).'

  const cuerpo = limpio.slice(0, -1)
  const digito = limpio.slice(-1)
  if (calcularDigitoVerificador(cuerpo) !== digito) {
    return 'El RUT no es válido (dígito verificador incorrecto).'
  }

  return ''
}

// Celular chileno: 9 + 8 dígitos, con o sin +56.
export function validarTelefono(valor = '') {
  const limpio = valor.replace(/[\s-]/g, '')

  if (!limpio) return 'El teléfono es obligatorio.'
  if (!/^(\+?56)?9\d{8}$/.test(limpio)) {
    return 'Ingresa un celular chileno válido (ej: +56 9 1234 5678).'
  }

  return ''
}

// "usuarios" es la lista de usuarios existentes, para detectar correo o RUT repetidos.
export function validarRegistro(datos, usuarios = []) {
  const errores = {}

  if (datos.nombre.trim().length < 3) {
    errores.nombre = 'El nombre debe tener al menos 3 caracteres.'
  }

  const errorRut = validarRut(datos.rut)
  const rutNormalizado = datos.rut.replace(/[.\-\s]/g, '').toUpperCase()
  if (errorRut) {
    errores.rut = errorRut
  } else if (usuarios.some((u) => u.rut.replace(/[.\-\s]/g, '').toUpperCase() === rutNormalizado)) {
    errores.rut = 'Ya existe una cuenta con ese RUT.'
  }

  const errorCorreo = validarCorreo(datos.correo)
  if (errorCorreo) {
    errores.correo = errorCorreo
  } else if (usuarios.some((u) => u.correo === datos.correo.trim().toLowerCase())) {
    errores.correo = 'Ya existe una cuenta con ese correo.'
  }

  const errorTelefono = validarTelefono(datos.telefono)
  if (errorTelefono) errores.telefono = errorTelefono

  if (!datos.tipoCliente) errores.tipoCliente = 'Selecciona el tipo de cliente.'
  if (!datos.region) errores.region = 'Selecciona una región.'
  if (!datos.comuna) errores.comuna = 'Selecciona una comuna.'

  if (datos.password.length < 6) {
    errores.password = 'La contraseña debe tener al menos 6 caracteres.'
  } else if (!/[A-Za-z]/.test(datos.password) || !/\d/.test(datos.password)) {
    errores.password = 'La contraseña debe incluir letras y números.'
  }

  if (datos.confirmarPassword !== datos.password) {
    errores.confirmarPassword = 'Las contraseñas no coinciden.'
  }

  if (!datos.terminos) {
    errores.terminos = 'Debes aceptar los términos y condiciones.'
  }

  return errores
}

// ---------- Checkout (carrito de compras) ----------
// Con retiro en tienda no se piden región, comuna ni dirección.
export function validarCheckout(datos) {
  const errores = {}

  if (datos.nombre.trim().length < 3) {
    errores.nombre = 'El nombre debe tener al menos 3 caracteres.'
  }

  const errorRut = validarRut(datos.rut)
  if (errorRut) errores.rut = errorRut

  const errorTelefono = validarTelefono(datos.telefono)
  if (errorTelefono) errores.telefono = errorTelefono

  if (!datos.tipoEntrega) {
    errores.tipoEntrega = 'Selecciona cómo quieres recibir tu pedido.'
  }

  if (datos.tipoEntrega === 'despacho') {
    if (!datos.region) errores.region = 'Selecciona una región.'
    if (!datos.comuna) errores.comuna = 'Selecciona una comuna.'
    if (datos.direccion.trim().length < 5) {
      errores.direccion = 'Ingresa la dirección de despacho (calle y número).'
    }
  }

  if (!datos.metodoPago) {
    errores.metodoPago = 'Selecciona un método de pago.'
  }

  return errores
}
