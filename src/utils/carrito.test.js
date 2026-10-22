import { describe, it, expect, beforeEach } from 'vitest'
import {
  obtenerCarrito,
  guardarCarrito,
  limpiarCarrito,
  contarUnidades,
  construirLineas,
  calcularTotalLineas,
  desglosarTotal,
} from './carrito'
import productos from '../data/productos'

describe('carrito', () => {
  beforeEach(() => {
    localStorage.clear()
  })

  it('guarda y recupera el carrito desde localStorage', () => {
    // Arrange
    const carrito = [{ id: 'MAT-CEM-001', cantidad: 2 }]

    // Act
    guardarCarrito(carrito)

    // Assert
    expect(obtenerCarrito()).toEqual(carrito)
  })

  it('devuelve un carrito vacío si no hay nada guardado', () => {
    // Arrange + Act
    const carrito = obtenerCarrito()

    // Assert
    expect(carrito).toEqual([])
  })

  it('cuenta el total de unidades', () => {
    // Arrange
    const carrito = [
      { id: 'MAT-CEM-001', cantidad: 2 },
      { id: 'ELE-CAB-002', cantidad: 3 },
    ]

    // Act
    const unidades = contarUnidades(carrito)

    // Assert
    expect(unidades).toBe(5)
  })

  it('quita del carrito los productos que ya no existen', () => {
    // Arrange
    const carrito = [
      { id: 'MAT-CEM-001', cantidad: 1 },
      { id: 'XXX-XXX-999', cantidad: 1 },
    ]

    // Act
    const limpio = limpiarCarrito(carrito, productos)

    // Assert
    expect(limpio).toEqual([{ id: 'MAT-CEM-001', cantidad: 1 }])
  })

  it('calcula el total de las líneas con precio por cantidad', () => {
    // Arrange
    const lineas = construirLineas([{ id: 'MAT-CEM-001', cantidad: 3 }], productos)

    // Act
    const total = calcularTotalLineas(lineas)

    // Assert
    expect(total).toBe(4890 * 3)
  })

  it('separa neto e IVA de un total con IVA incluido', () => {
    // Arrange
    const total = 11900

    // Act
    const desglose = desglosarTotal(total)

    // Assert
    expect(desglose).toEqual({ neto: 10000, iva: 1900, total: 11900 })
  })
})
