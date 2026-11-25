import { describe, it, expect, beforeEach } from 'vitest'
import AuthService from './AuthService'
import { iniciarSesion, registrarCuenta } from './SesionService'
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

  it('si la API informa la ficha de cliente, el perfil y el rol salen de ella', async () => {
    // Arrange
    AuthService.login.mockResolvedValueOnce({
      ...respuestaAdmin,
      usuario: { id: 9, nombre: 'Maria Soto', correo: 'maria@correo.cl', rol: 'USER' },
      cliente: { rut: '12.345.679-3', telefono: '+56 9 1111 2222', tipoCliente: 'contratista', region: 'coquimbo', comuna: 'Ovalle' },
    })

    // Act
    const usuario = await iniciarSesion('maria@correo.cl', 'Clave123')

    // Assert
    expect(usuario).toMatchObject({ rol: 'contratista', rut: '12.345.679-3', comuna: 'Ovalle' })
  })
})

describe('registrarCuenta', () => {
  const formulario = {
    nombre: ' Juan Pérez ',
    rut: '9876543-3',
    correo: ' Juan@Correo.cl ',
    telefono: '+56 9 1234 5678',
    tipoCliente: 'particular',
    region: 'coquimbo',
    comuna: 'La Serena',
    password: 'Clave123',
    confirmarPassword: 'Clave123',
    terminos: true,
  }

  beforeEach(() => {
    localStorage.clear()
  })

  it('envía los datos normalizados a la API y guarda la sesión con el token', async () => {
    // Arrange
    AuthService.registro.mockResolvedValueOnce({
      token: 'token-nuevo',
      tipo: 'Bearer',
      expiraEnMinutos: 60,
      usuario: { id: 7, nombre: 'Juan Pérez', correo: 'juan@correo.cl', rol: 'USER' },
      cliente: { rut: '9.876.543-3', telefono: '+56 9 1234 5678', tipoCliente: 'particular', region: 'coquimbo', comuna: 'La Serena' },
    })

    // Act
    const usuario = await registrarCuenta(formulario)

    // Assert
    expect(AuthService.registro).toHaveBeenCalledWith({
      nombre: 'Juan Pérez',
      correo: 'juan@correo.cl',
      password: 'Clave123',
      rut: '9.876.543-3',
      telefono: '+56 9 1234 5678',
      tipoCliente: 'particular',
      region: 'coquimbo',
      comuna: 'La Serena',
    })
    expect(usuario).toMatchObject({ rol: 'cliente', token: 'token-nuevo', rut: '9.876.543-3' })
    expect(obtenerSesion().token).toBe('token-nuevo')
  })

  it('si la API rechaza el registro propaga el error y no guarda ninguna sesión', async () => {
    // Arrange
    AuthService.registro.mockRejectedValueOnce({ response: { status: 409, data: { mensaje: 'Ya existe un cliente con ese RUT.' } } })

    // Act + Assert
    await expect(registrarCuenta(formulario)).rejects.toMatchObject({ response: { status: 409 } })
    expect(obtenerSesion()).toBeNull()
  })
})
