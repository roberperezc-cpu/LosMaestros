import { describe, it, expect, beforeEach } from 'vitest'
import AuthService from './AuthService'
import { iniciarSesion } from './SesionService'
import { obtenerSesion } from '../utils/sesion'

const respuestaAdmin = {
  token: 'token-de-prueba',
  tipo: 'Bearer',
  expiraEnMinutos: 60,
  usuario: { id: 1, nombre: 'Administrador', correo: 'admin@losmaestros.cl', rol: 'ADMIN' },
}

describe('iniciarSesion', () => {
  beforeEach(() => {
    localStorage.clear()
  })

  it('con la API disponible guarda el token y completa el perfil con los datos locales', async () => {
    // Arrange
    AuthService.login.mockResolvedValueOnce(respuestaAdmin)

    // Act
    const usuario = await iniciarSesion('Admin@LosMaestros.cl', 'Admin123')

    // Assert
    expect(usuario).toMatchObject({ rol: 'admin', token: 'token-de-prueba', rut: '11.111.111-1' })
    expect(obtenerSesion().token).toBe('token-de-prueba')
  })

  it('un usuario que solo existe en la API recibe un rol según el que informa el servidor', async () => {
    // Arrange
    AuthService.login.mockResolvedValueOnce({
      ...respuestaAdmin,
      usuario: { id: 9, nombre: 'Maria Soto', correo: 'maria@correo.cl', rol: 'USER' },
    })

    // Act
    const usuario = await iniciarSesion('maria@correo.cl', 'Clave123')

    // Assert
    expect(usuario).toMatchObject({ nombre: 'Maria Soto', rol: 'cliente', token: 'token-de-prueba' })
  })

  it('si la API no responde usa los usuarios locales, sin token', async () => {
    // Arrange (AuthService.login rechaza por defecto en las pruebas)

    // Act
    const usuario = await iniciarSesion('contratista@losmaestros.cl', 'Maestro123')

    // Assert
    expect(usuario).toMatchObject({ rol: 'contratista' })
    expect(usuario.token).toBeUndefined()
    expect(obtenerSesion()).toMatchObject({ correo: 'contratista@losmaestros.cl' })
  })

  it('si la API y los usuarios locales rechazan las credenciales devuelve null', async () => {
    // Arrange (la API simulada rechaza)

    // Act
    const usuario = await iniciarSesion('admin@losmaestros.cl', 'ClaveIncorrecta')

    // Assert
    expect(usuario).toBeNull()
    expect(obtenerSesion()).toBeNull()
  })
})
