import axios from 'axios'
import { cerrarSesion, obtenerSesion } from '../utils/sesion'

// Dirección del backend. Se puede cambiar con la variable VITE_API_URL (archivo .env).
const URL_BASE = import.meta.env.VITE_API_URL || 'http://localhost:8080/api'

const api = axios.create({ baseURL: URL_BASE })

// Si hay una sesión con token JWT, se envía en cada petición: "Authorization: Bearer <token>".
export function agregarToken(config) {
  const sesion = obtenerSesion()

  if (sesion && sesion.token) {
    config.headers.Authorization = `Bearer ${sesion.token}`
  }
  return config
}

// Cambiar de página es una acción aparte para poder probarla sin recargar el navegador.
export const navegador = {
  irA: (ruta) => window.location.assign(ruta),
}

// El token dura 60 minutos. Si el servidor responde 401 a una petición que llevaba token, el token
// venció (o no es válido): se cierra la sesión y se lleva al login con un aviso.
// Las peticiones de /auth se excluyen: un 401 al iniciar sesión solo significa contraseña incorrecta.
export function manejarErrorDeRespuesta(error) {
  const sesion = obtenerSesion()
  const url = (error.config && error.config.url) || ''
  const esAutenticacion = url.startsWith('/auth')

  if (error.response && error.response.status === 401 && sesion && sesion.token && !esAutenticacion) {
    cerrarSesion()
    navegador.irA('/login?expirada=1')
  }
  return Promise.reject(error)
}

api.interceptors.request.use(agregarToken)
api.interceptors.response.use((respuesta) => respuesta, manejarErrorDeRespuesta)

export default api
