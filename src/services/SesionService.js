import AuthService from './AuthService'
import { autenticar, guardarSesion } from '../utils/sesion'
import { formatearRut, obtenerTodosLosUsuarios, quitarPassword } from '../utils/usuarios'

// Rol que usa la interfaz según lo que informa la API.
// El rol real (ADMIN o USER) lo decide siempre el servidor con el token; este valor solo
// sirve para mostrar u ocultar pantallas.
function rolDeLaInterfaz(respuesta, perfilLocal) {
  if (respuesta.usuario.rol === 'ADMIN') return 'admin'
  if (respuesta.cliente) return respuesta.cliente.tipoCliente === 'contratista' ? 'contratista' : 'cliente'
  return perfilLocal && perfilLocal.rol !== 'admin' ? perfilLocal.rol : 'cliente'
}

// Arma la sesión a partir de la respuesta de login o de registro.
function construirSesion(respuesta) {
  const perfilLocal = obtenerTodosLosUsuarios().find((u) => u.correo === respuesta.usuario.correo)
  const { cliente } = respuesta

  return {
    ...(perfilLocal ? quitarPassword(perfilLocal) : {}),
    ...(cliente
      ? {
          rut: cliente.rut,
          telefono: cliente.telefono,
          tipoCliente: cliente.tipoCliente,
          region: cliente.region,
          comuna: cliente.comuna,
        }
      : {}),
    id: respuesta.usuario.id,
    nombre: respuesta.usuario.nombre,
    correo: respuesta.usuario.correo,
    rol: rolDeLaInterfaz(respuesta, perfilLocal),
    token: respuesta.token,
  }
}

/**
 * Inicia sesión y guarda la sesión. Devuelve el usuario, o null si las credenciales no sirven.
 * 1) Intenta con la API: si responde, la sesión incluye el token JWT (necesario para crear,
 *    editar y eliminar productos).
 * 2) Si la API rechaza las credenciales o no está disponible, se prueba con los usuarios
 *    locales (los de data/usuarios.js). Esa sesión no tiene token.
 */
export async function iniciarSesion(correo, password) {
  try {
    const respuesta = await AuthService.login(correo.trim().toLowerCase(), password)
    const usuario = construirSesion(respuesta)

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

/**
 * Registra una cuenta nueva en la base de datos (usuario con rol USER y ficha de cliente),
 * inicia sesión y guarda la sesión con el token. Si la API falla (correo o RUT repetido,
 * datos inválidos, sin conexión) el error se propaga para mostrarlo en el formulario.
 */
export async function registrarCuenta(formulario) {
  const respuesta = await AuthService.registro({
    nombre: formulario.nombre.trim(),
    correo: formulario.correo.trim().toLowerCase(),
    password: formulario.password,
    rut: formatearRut(formulario.rut),
    telefono: formulario.telefono.trim(),
    tipoCliente: formulario.tipoCliente,
    region: formulario.region,
    comuna: formulario.comuna,
  })

  const usuario = construirSesion(respuesta)
  guardarSesion(usuario)
  return usuario
}
