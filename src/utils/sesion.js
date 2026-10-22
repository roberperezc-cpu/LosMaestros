import { obtenerTodosLosUsuarios, quitarPassword } from './usuarios'

const CLAVE_SESION = 'sesionLosMaestros'

// Devuelve el usuario (sin contraseña) si las credenciales son correctas; si no, null.
// Busca entre los usuarios estáticos y los creados desde el registro.
export function autenticar(correo, password) {
  const usuario = obtenerTodosLosUsuarios().find(
    (u) => u.correo === correo.trim().toLowerCase() && u.password === password,
  )

  return usuario ? quitarPassword(usuario) : null
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
