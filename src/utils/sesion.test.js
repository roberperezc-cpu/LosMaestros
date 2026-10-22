import { describe, it, expect, beforeEach } from 'vitest'
import { autenticar, guardarSesion, obtenerSesion, cerrarSesion } from './sesion'

describe('sesión', () => {
  beforeEach(() => {
    localStorage.clear()
  })

  it('autentica al administrador con credenciales correctas y sin exponer la contraseña', () => {
    // Arrange
    const correo = 'admin@losmaestros.cl'
    const password = 'Admin123'

    // Act
    const usuario = autenticar(correo, password)

    // Assert
    expect(usuario).toMatchObject({ rol: 'admin', correo })
    expect(usuario).not.toHaveProperty('password')
  })

  it('devuelve null con credenciales incorrectas', () => {
    // Arrange
    const correo = 'admin@losmaestros.cl'

    // Act
    const usuario = autenticar(correo, 'clave-equivocada')

    // Assert
    expect(usuario).toBeNull()
  })

  it('guarda y recupera la sesión desde localStorage', () => {
    // Arrange
    const usuario = { id: 1, nombre: 'Administrador', rol: 'admin' }

    // Act
    guardarSesion(usuario)

    // Assert
    expect(obtenerSesion()).toEqual(usuario)
  })

  it('cerrarSesion elimina la sesión guardada', () => {
    // Arrange
    guardarSesion({ id: 1, nombre: 'Administrador', rol: 'admin' })

    // Act
    cerrarSesion()

    // Assert
    expect(obtenerSesion()).toBeNull()
  })
})
