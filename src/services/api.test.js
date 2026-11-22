import { describe, it, expect, beforeEach } from 'vitest'
import { agregarToken } from './api'
import { guardarSesion } from '../utils/sesion'

describe('agregarToken', () => {
  beforeEach(() => {
    localStorage.clear()
  })

  it('agrega el encabezado Authorization cuando la sesión tiene token', () => {
    // Arrange
    guardarSesion({ correo: 'admin@losmaestros.cl', token: 'abc123' })

    // Act
    const config = agregarToken({ headers: {} })

    // Assert
    expect(config.headers.Authorization).toBe('Bearer abc123')
  })

  it('no agrega el encabezado si no hay sesión', () => {
    // Arrange + Act
    const config = agregarToken({ headers: {} })

    // Assert
    expect(config.headers.Authorization).toBeUndefined()
  })

  it('no agrega el encabezado si la sesión es local y no tiene token', () => {
    // Arrange
    guardarSesion({ correo: 'contratista@losmaestros.cl' })

    // Act
    const config = agregarToken({ headers: {} })

    // Assert
    expect(config.headers.Authorization).toBeUndefined()
  })
})
