import { describe, it, expect } from 'vitest'
import { construirMenu } from './menu'

const etiquetas = (items) => items.map((item) => item.label)

describe('construirMenu', () => {
  it('sin sesión muestra "Acceso Contratista" y oculta el Panel Admin', () => {
    // Arrange + Act
    const items = construirMenu(null)

    // Assert
    expect(etiquetas(items)).toContain('Acceso Contratista')
    expect(etiquetas(items)).not.toContain('Panel Admin')
  })

  it('con sesión de administrador muestra Panel Admin y Cerrar sesión', () => {
    // Arrange
    const sesion = { nombre: 'Administrador', rol: 'admin' }

    // Act
    const items = construirMenu(sesion, () => {})

    // Assert
    expect(etiquetas(items)).toContain('Panel Admin')
    expect(etiquetas(items)).toContain('Cerrar sesión (Administrador)')
    expect(etiquetas(items)).not.toContain('Acceso Contratista')
  })

  it('con sesión de contratista no muestra el Panel Admin', () => {
    // Arrange
    const sesion = { nombre: 'Constructora Elqui', rol: 'contratista' }

    // Act
    const items = construirMenu(sesion, () => {})

    // Assert
    expect(etiquetas(items)).not.toContain('Panel Admin')
  })
})

describe('construirMenu (carrito)', () => {
  it('muestra "Carrito" sin cantidad cuando está vacío', () => {
    // Arrange + Act
    const items = construirMenu(null, () => {}, 0)

    // Assert
    expect(items.map((item) => item.label)).toContain('Carrito')
  })

  it('muestra la cantidad de unidades cuando hay productos', () => {
    // Arrange + Act
    const items = construirMenu(null, () => {}, 3)

    // Assert
    expect(items.map((item) => item.label)).toContain('Carrito (3)')
  })
})
