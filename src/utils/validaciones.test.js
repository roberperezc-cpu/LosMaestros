import { describe, it, expect } from 'vitest'
import { validarCorreo, validarPassword, validarLogin } from './validaciones'

describe('validarCorreo', () => {
  it('rechaza un correo vacío', () => {
    // Arrange
    const valor = '   '

    // Act
    const resultado = validarCorreo(valor)

    // Assert
    expect(resultado).toBe('El correo es obligatorio.')
  })

  it('rechaza un correo sin formato válido', () => {
    // Arrange
    const valor = 'correo-sin-arroba'

    // Act
    const resultado = validarCorreo(valor)

    // Assert
    expect(resultado).toMatch(/correo válido/i)
  })

  it('acepta un correo válido', () => {
    // Arrange
    const valor = 'admin@losmaestros.cl'

    // Act
    const resultado = validarCorreo(valor)

    // Assert
    expect(resultado).toBe('')
  })
})

describe('validarPassword', () => {
  it('rechaza una contraseña de menos de 6 caracteres', () => {
    // Arrange
    const valor = '123'

    // Act
    const resultado = validarPassword(valor)

    // Assert
    expect(resultado).toMatch(/al menos 6/i)
  })
})

describe('validarLogin', () => {
  it('devuelve un error por cada campo inválido', () => {
    // Arrange
    const datos = { correo: '', password: '' }

    // Act
    const errores = validarLogin(datos)

    // Assert
    expect(Object.keys(errores)).toEqual(['correo', 'password'])
  })

  it('devuelve un objeto vacío cuando todo es válido', () => {
    // Arrange
    const datos = { correo: 'admin@losmaestros.cl', password: 'Admin123' }

    // Act
    const errores = validarLogin(datos)

    // Assert
    expect(errores).toEqual({})
  })
})
