import usuariosBase from '../data/usuarios'

const CLAVE_USUARIOS = 'usuariosRegistrados'

// Devuelve una copia del usuario sin la contraseña (es lo que se guarda en la sesión).
export function quitarPassword(usuario) {
  return Object.fromEntries(Object.entries(usuario).filter(([clave]) => clave !== 'password'))
}

export function normalizarRut(valor = '') {
  return valor.replace(/[.\-\s]/g, '').toUpperCase()
}

// 123456785 -> 12.345.678-5
export function formatearRut(valor = '') {
  const limpio = normalizarRut(valor)
  const cuerpo = limpio.slice(0, -1)
  const dv = limpio.slice(-1)
  return `${cuerpo.replace(/\B(?=(\d{3})+(?!\d))/g, '.')}-${dv}`
}

export function obtenerUsuariosRegistrados() {
  try {
    return JSON.parse(localStorage.getItem(CLAVE_USUARIOS)) || []
  } catch {
    return [] // el valor guardado estaba corrupto
  }
}

// Usuarios estáticos + usuarios creados desde la página de registro.
export function obtenerTodosLosUsuarios() {
  return [...usuariosBase, ...obtenerUsuariosRegistrados()]
}

// Guarda un usuario nuevo y devuelve sus datos públicos (sin contraseña).
export function registrarUsuario(datos) {
  const nuevo = {
    id: Date.now(),
    nombre: datos.nombre.trim(),
    correo: datos.correo.trim().toLowerCase(),
    password: datos.password,
    rol: 'cliente',
    rut: formatearRut(datos.rut),
    telefono: datos.telefono.trim(),
    region: datos.region,
    comuna: datos.comuna,
    tipoCliente: datos.tipoCliente,
  }

  localStorage.setItem(CLAVE_USUARIOS, JSON.stringify([...obtenerUsuariosRegistrados(), nuevo]))

  return quitarPassword(nuevo)
}
