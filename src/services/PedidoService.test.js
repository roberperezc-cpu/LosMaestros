import { describe, it, expect, vi, beforeAll, afterEach } from 'vitest'
import api from './api'

// En setupTests el servicio está reemplazado por una simulación; aquí se prueba el verdadero.
let servicio

beforeAll(async () => {
  const modulo = await vi.importActual('./PedidoService.js')
  servicio = modulo.default
})

afterEach(() => {
  vi.restoreAllMocks()
})

describe('PedidoService', () => {
  it('confirmar envía un POST a /pedidos y devuelve el comprobante', async () => {
    // Arrange
    const pedido = {
      tipoEntrega: 'retiro',
      metodoPago: 'transferencia',
      direccionEntrega: null,
      items: [{ productoId: 'MAT-CEM-001', cantidad: 2 }],
    }
    const comprobante = { numeroPedido: 'PED-261123-043015-47', total: 9780, lineas: [] }
    const post = vi.spyOn(api, 'post').mockResolvedValue({ data: comprobante })

    // Act
    const resultado = await servicio.confirmar(pedido)

    // Assert
    expect(post).toHaveBeenCalledWith('/pedidos', pedido)
    expect(resultado).toEqual(comprobante)
  })

  it('si la API rechaza la compra, el error llega a quien llamó', async () => {
    // Arrange
    vi.spyOn(api, 'post').mockRejectedValue({ response: { status: 409 } })

    // Act + Assert
    await expect(servicio.confirmar({ items: [] })).rejects.toMatchObject({ response: { status: 409 } })
  })
})
