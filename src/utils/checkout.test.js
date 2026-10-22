import { describe, it, expect } from 'vitest'
import { validarCheckout } from './validaciones'

const retiroValido = {
  nombre: 'Juan Pérez',
  rut: '12.345.678-5',
  telefono: '+56 9 1234 5678',
  tipoEntrega: 'retiro',
  region: '',
  comuna: '',
  direccion: '',
  metodoPago: 'transferencia',
}

describe('validarCheckout', () => {
  it('con retiro en tienda no exige región, comuna ni dirección', () => {
    // Arrange
    const datos = { ...retiroValido }

    // Act
    const errores = validarCheckout(datos)

    // Assert
    expect(errores).toEqual({})
  })

  it('con despacho exige región, comuna y dirección', () => {
    // Arrange
    const datos = { ...retiroValido, tipoEntrega: 'despacho' }

    // Act
    const errores = validarCheckout(datos)

    // Assert
    expect(Object.keys(errores).sort()).toEqual(['comuna', 'direccion', 'region'])
  })

  it('rechaza un RUT inválido y exige método de pago', () => {
    // Arrange
    const datos = { ...retiroValido, rut: '12.345.678-9', metodoPago: '' }

    // Act
    const errores = validarCheckout(datos)

    // Assert
    expect(errores.rut).toBeDefined()
    expect(errores.metodoPago).toBe('Selecciona un método de pago.')
  })
})
