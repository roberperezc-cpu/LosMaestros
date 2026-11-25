import api from './api'

// Autenticación contra la API. Ambas operaciones devuelven
// { token, tipo, expiraEnMinutos, usuario, cliente } (cliente es null para el administrador).
class AuthService {
  login(correo, password) {
    return api.post('/auth/login', { correo, password }).then((respuesta) => respuesta.data)
  }

  // Crea la cuenta (tabla usuarios) y la ficha del cliente (tabla clientes) en MySQL.
  registro(datos) {
    return api.post('/auth/registro', datos).then((respuesta) => respuesta.data)
  }
}

export default new AuthService()
