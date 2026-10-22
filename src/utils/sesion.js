import usuarios from '../data/usuarios'

const CLAVE_SESION = 'sesionLosMaestros'

// Devuelve el usuario (sin contraseña) si las credenciales son correctas; si no, null.
export function autenticar(correo, password) {
  const usuario = usuarios.find(
    (u) => u.correo === correo.trim().toLowerCase() && u.password === password,
  )

  if (!usuario) return null

  return { id: usuario.id, nombre: usuario.nombre, correo: usuario.correo, rol: usuario.rol }
}

export function guardarSesion(usuario) {
  localStorage.setItem(CLAVE_SESION, JSON.stringify(usuario))
}

export function obtenerSesion() {
  try {
    return JSON.parse(localStorage.getItem(CLAVE_SESION))
  } catch {
    return null // el valor guardado estaba corrupto
  }
}

export function cerrarSesion() {
  localStorage.removeItem(CLAVE_SESION)
}
