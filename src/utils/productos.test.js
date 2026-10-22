import { describe, it, expect } from 'vitest'
import { validarProducto } from './validaciones'
import { crearProducto } from './productos'
import productos from '../data/productos'

const datosValidos = {
  sku: 'her-mar-010',
  nombre: '  Martillo Carpintero 16oz ',
  categoria: 'herramientas-man',
  precio: '9990',
  stock: '25',
  stockMinimo: '5',
  ubicacion: 'Pasillo C - Estante 1',
  marca: 'Stanley',
}

describe('validarProducto', () => {
  it('acepta un producto con todos los datos correctos', () => {
    // Arrange
    const datos = { ...datosValidos }

    // Act
    const errores = validarProducto(datos, productos)

    // Assert
    expect(errores).toEqual({})
  })

  it('rechaza un SKU con formato inválido', () => {
    // Arrange
    const datos = { ...datosValidos, sku: 'martillo1' }

    // Act
    const errores = validarProducto(datos, productos)

    // Assert
    expect(errores.sku).toMatch(/formato inválido/i)
  })

  it('rechaza un SKU que ya existe, sin importar mayúsculas', () => {
    // Arrange
    const datos = { ...datosValidos, sku: 'mat-cem-001' }

    // Act
    const errores = validarProducto(datos, productos)

    // Assert
    expect(errores.sku).toBe('Ya existe un producto con ese SKU.')
  })

  it('rechaza precio 0, negativo o con decimales', () => {
    // Arrange
    const precios = ['0', '-500', '99.5', '']

    // Act
    const resultados = precios.map((precio) => validarProducto({ ...datosValidos, precio }, productos))

    // Assert
    resultados.forEach((errores) => expect(errores.precio).toBeDefined())
  })

  it('permite stock 0 pero rechaza stock negativo', () => {
    // Arrange + Act
    const conCero = validarProducto({ ...datosValidos, stock: '0' }, productos)
    const negativo = validarProducto({ ...datosValidos, stock: '-3' }, productos)

    // Assert
    expect(conCero.stock).toBeUndefined()
    expect(negativo.stock).toBeDefined()
  })
})

describe('crearProducto', () => {
  it('convierte los textos del formulario a un producto del catálogo', () => {
    // Arrange
    const datos = { ...datosValidos }

    // Act
    const producto = crearProducto(datos)

    // Assert
    expect(producto).toMatchObject({
      id: 'HER-MAR-010',
      nombre: 'Martillo Carpintero 16oz',
      categoriaNombre: 'Herramientas Manuales',
      precio: 9990,
      stock: 25,
      stockMinimo: 5,
      especificaciones: { Marca: 'Stanley' },
    })
  })

  it('asigna una imagen genérica y no agrega especificaciones sin marca', () => {
    // Arrange
    const datos = { ...datosValidos, marca: '' }

    // Act
    const producto = crearProducto(datos)

    // Assert
    expect(producto.imagen).toBeTruthy()
    expect(producto.especificaciones).toEqual({})
  })
})
