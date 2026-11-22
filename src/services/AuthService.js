import api from './api'

// Inicio de sesión contra la API: devuelve { token, tipo, expiraEnMinutos, usuario }.
class AuthService {
  login(correo, password) {
    return api.post('/auth/login', { correo, password }).then((respuesta) => respuesta.data)
  }
}

export default new AuthService()
