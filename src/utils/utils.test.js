import { describe, it, expect } from 'vitest'
import { obtenerEstadoStock, productosParaReponer } from './stock'
import { filtrarProductos } from './filtros'
import productos from '../data/productos'

describe('obtenerEstadoStock', () => {
  it('marca Agotado cuando el stock es 0', () => {
    expect(obtenerEstadoStock({ stock: 0, stockMinimo: 5 })).toEqual({
      clase: 'stock-out',
      texto: 'Agotado',
    })
  })

  it('marca Bajo Stock cuando está en o bajo el mínimo', () => {
    expect(obtenerEstadoStock({ stock: 5, stockMinimo: 5 }).texto).toBe('Bajo Stock')
  })

  it('marca En Stock cuando supera el mínimo', () => {
    expect(obtenerEstadoStock({ stock: 142, stockMinimo: 20 })).toEqual({
      clase: 'stock-ok',
      texto: 'En Stock',
    })
  })
})

describe('productosParaReponer', () => {
  it('devuelve el taladro (bajo stock) y el tubo (agotado)', () => {
    const ids = productosParaReponer(productos).map((p) => p.id)
    expect(ids).toEqual(['HER-TAL-042', 'GAS-PVC-110'])
  })
})

describe('filtrarProductos', () => {
  it('sin filtros devuelve todo', () => {
    expect(filtrarProductos(productos)).toHaveLength(productos.length)
  })

  it('busca por nombre sin distinguir mayúsculas', () => {
    const r = filtrarProductos(productos, 'TALADRO')
    expect(r.map((p) => p.id)).toEqual(['HER-TAL-042'])
  })

  it('busca por SKU', () => {
    expect(filtrarProductos(productos, 'cab-002')).toHaveLength(1)
  })

  it('filtra por categoría', () => {
    const r = filtrarProductos(productos, '', 'gasfiteria')
    expect(r.map((p) => p.id)).toEqual(['GAS-PVC-110'])
  })

  it('combina texto y categoría', () => {
    expect(filtrarProductos(productos, 'cemento', 'gasfiteria')).toHaveLength(0)
  })
})
