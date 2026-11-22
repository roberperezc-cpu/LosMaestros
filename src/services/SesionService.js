import AuthService from './AuthService'
import { autenticar, guardarSesion } from '../utils/sesion'
import { obtenerTodosLosUsuarios, quitarPassword } from '../utils/usuarios'

// Roles del backend -> roles de la interfaz (si el usuario no tiene perfil local).
const ROLES_API = { ADMIN: 'admin', USER: 'cliente' }

/**
 * Inicia sesión y guarda la sesión. Devuelve el usuario, o null si las credenciales no sirven.
 * 1) Intenta con la API: si responde, la sesión incluye el token JWT (necesario para crear,
 *    editar y eliminar productos).
 * 2) Si la API rechaza las credenciales o no está disponible, se prueba con los usuarios
 *    locales (los de data/usuarios.js y los creados en /registro). Esa sesión no tiene token.
 */
export async function iniciarSesion(correo, password) {
  const correoNormalizado = correo.trim().toLowerCase()

  try {
    const respuesta = await AuthService.login(correoNormalizado, password)
    const perfilLocal = obtenerTodosLosUsuarios().find((u) => u.correo === correoNormalizado)

    const usuario = {
      ...(perfilLocal ? quitarPassword(perfilLocal) : {}),
      id: respuesta.usuario.id,
      nombre: respuesta.usuario.nombre,
      correo: respuesta.usuario.correo,
      rol: perfilLocal ? perfilLocal.rol : ROLES_API[respuesta.usuario.rol] || 'cliente',
      token: respuesta.token,
    }

    guardarSesion(usuario)
    return usuario
  } catch {
    const usuarioLocal = autenticar(correo, password)

    if (usuarioLocal) {
      guardarSesion(usuarioLocal)
    }
    return usuarioLocal
  }
}
