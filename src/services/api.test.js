import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest'
import { agregarToken, manejarErrorDeRespuesta, navegador } from './api'
import { guardarSesion, obtenerSesion } from '../utils/sesion'

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

describe('manejarErrorDeRespuesta', () => {
  beforeEach(() => {
    localStorage.clear()
    vi.spyOn(navegador, 'irA').mockImplementation(() => {})
  })

  afterEach(() => {
    vi.restoreAllMocks()
  })

  it('un 401 con token cierra la sesión y lleva al login con el aviso', async () => {
    // Arrange
    guardarSesion({ correo: 'admin@losmaestros.cl', token: 'vencido' })
    const error = { response: { status: 401 }, config: { url: '/productos' } }

    // Act
    const resultado = manejarErrorDeRespuesta(error)

    // Assert
    await expect(resultado).rejects.toBe(error)
    expect(obtenerSesion()).toBeNull()
    expect(navegador.irA).toHaveBeenCalledWith('/login?expirada=1')
  })

  it('un 401 al iniciar sesión (contraseña incorrecta) no cierra nada', async () => {
    // Arrange
    guardarSesion({ correo: 'admin@losmaestros.cl', token: 'vigente' })
    const error = { response: { status: 401 }, config: { url: '/auth/login' } }

    // Act
    const resultado = manejarErrorDeRespuesta(error)

    // Assert
    await expect(resultado).rejects.toBe(error)
    expect(obtenerSesion()).not.toBeNull()
    expect(navegador.irA).not.toHaveBeenCalled()
  })

  it('un 403 (falta de permisos) no cierra la sesión', async () => {
    // Arrange
    guardarSesion({ correo: 'maria@correo.cl', token: 'vigente' })
    const error = { response: { status: 403 }, config: { url: '/productos' } }

    // Act
    const resultado = manejarErrorDeRespuesta(error)

    // Assert
    await expect(resultado).rejects.toBe(error)
    expect(obtenerSesion()).not.toBeNull()
    expect(navegador.irA).not.toHaveBeenCalled()
  })

  it('un 401 sin token en la sesión no redirige', async () => {
    // Arrange
    guardarSesion({ correo: 'contratista@losmaestros.cl' })
    const error = { response: { status: 401 }, config: { url: '/productos' } }

    // Act
    const resultado = manejarErrorDeRespuesta(error)

    // Assert
    await expect(resultado).rejects.toBe(error)
    expect(navegador.irA).not.toHaveBeenCalled()
  })
})
