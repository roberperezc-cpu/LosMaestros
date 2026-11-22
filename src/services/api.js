import axios from 'axios'
import { obtenerSesion } from '../utils/sesion'

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

api.interceptors.request.use(agregarToken)

export default api
