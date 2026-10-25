import { describe, it, expect } from 'vitest'
import { obtenerEstadoStock, productosParaReponer } from './stock'
import { filtrarProductos } from './filtros'
import productos from '../data/productos'

describe('obtenerEstadoStock', () => {
  it('marca Agotado cuando el stock es 0', () => {
    // Arrange
    const producto = { stock: 0, stockMinimo: 5 }

    // Act
    const estado = obtenerEstadoStock(producto)

    // Assert
    expect(estado).toEqual({ clase: 'stock-out', texto: 'Agotado' })
  })

  it('marca Bajo Stock cuando está en o bajo el mínimo', () => {
    // Arrange
    const producto = { stock: 5, stockMinimo: 5 }

    // Act
    const estado = obtenerEstadoStock(producto)

    // Assert
    expect(estado.texto).toBe('Bajo Stock')
  })

  it('marca En Stock cuando supera el mínimo', () => {
    // Arrange
    const producto = { stock: 142, stockMinimo: 20 }

    // Act
    const estado = obtenerEstadoStock(producto)

    // Assert
    expect(estado).toEqual({ clase: 'stock-ok', texto: 'En Stock' })
  })
})

describe('productosParaReponer', () => {
  it('devuelve el taladro (bajo stock) y el tubo (agotado)', () => {
    // Arrange
    const inventario = productos

    // Act
    const ids = productosParaReponer(inventario).map((p) => p.id)

    // Assert
    expect(ids).toEqual(['HER-TAL-042', 'GAS-PVC-110'])
  })
})

describe('filtrarProductos', () => {
  it('sin filtros devuelve todo', () => {
    // Arrange
    const inventario = productos

    // Act
    const resultado = filtrarProductos(inventario)

    // Assert
    expect(resultado).toHaveLength(inventario.length)
  })

  it('busca por nombre sin distinguir mayúsculas', () => {
    // Arrange
    const texto = 'TALADRO'

    // Act
    const resultado = filtrarProductos(productos, texto)

    // Assert
    expect(resultado.map((p) => p.id)).toEqual(['HER-TAL-042'])
  })

  it('busca por SKU', () => {
    // Arrange
    const texto = 'cab-002'

    // Act
    const resultado = filtrarProductos(productos, texto)

    // Assert
    expect(resultado).toHaveLength(1)
  })

  it('filtra por categoría', () => {
    // Arrange
    const categoria = 'gasfiteria'

    // Act
    const resultado = filtrarProductos(productos, '', categoria)

    // Assert
    expect(resultado.map((p) => p.id)).toEqual(['GAS-PVC-110'])
  })

  it('combina texto y categoría', () => {
    // Arrange
    const texto = 'cemento'
    const categoria = 'gasfiteria'

    // Act
    const resultado = filtrarProductos(productos, texto, categoria)

    // Assert
    expect(resultado).toHaveLength(0)
  })
})
