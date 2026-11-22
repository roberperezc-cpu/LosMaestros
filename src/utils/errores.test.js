import { describe, it, expect } from 'vitest'
import { mensajeDeError } from './errores'

describe('mensajeDeError', () => {
  it('sin respuesta del servidor avisa que no hay conexión', () => {
    // Arrange
    const error = new Error('Network Error')

    // Act
    const mensaje = mensajeDeError(error)

    // Assert
    expect(mensaje).toMatch(/No se pudo conectar/)
  })

  it('401 pide iniciar sesión de nuevo', () => {
    // Arrange
    const error = { response: { status: 401 } }

    // Act
    const mensaje = mensajeDeError(error)

    // Assert
    expect(mensaje).toMatch(/Inicia sesión/)
  })

  it('403 indica que faltan permisos', () => {
    // Arrange
    const error = { response: { status: 403 } }

    // Act
    const mensaje = mensajeDeError(error)

    // Assert
    expect(mensaje).toBe('No tienes permisos para realizar esta acción.')
  })

  it('400 une los errores de validación por campo', () => {
    // Arrange
    const error = { response: { status: 400, data: { errores: { id: 'SKU inválido.', precio: 'Precio inválido.' } } } }

    // Act
    const mensaje = mensajeDeError(error)

    // Assert
    expect(mensaje).toBe('SKU inválido. Precio inválido.')
  })

  it('409 usa el mensaje que envía el servidor', () => {
    // Arrange
    const error = { response: { status: 409, data: { mensaje: 'Ya existe un producto con ese SKU.' } } }

    // Act
    const mensaje = mensajeDeError(error)

    // Assert
    expect(mensaje).toBe('Ya existe un producto con ese SKU.')
  })
})
