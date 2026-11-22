import { describe, it, expect, vi, beforeAll, afterEach } from 'vitest'
import api from './api'

// En setupTests el servicio está reemplazado por una simulación; aquí se prueba el verdadero.
let servicio

beforeAll(async () => {
  const modulo = await vi.importActual('./ProductoService.js')
  servicio = modulo.default
})

afterEach(() => {
  vi.restoreAllMocks()
})

const productoDeEjemplo = {
  id: 'HER-MAR-010',
  nombre: 'Martillo Carpintero 16oz',
  categoria: 'herramientas-man',
  categoriaNombre: 'Herramientas Manuales',
  precio: 9990,
  stock: 25,
  stockMinimo: 5,
  ubicacion: 'Pasillo C - Estante 1',
  especificaciones: { Marca: 'Stanley' },
}

describe('ProductoService', () => {
  it('obtenerTodos pide /productos y convierte la respuesta HAL', async () => {
    // Arrange
    const respuesta = {
      data: {
        _embedded: {
          productos: [{ ...productoDeEjemplo, imagen: 'taladro.jpg', especificaciones: '{"Marca":"Stanley"}' }],
        },
      },
    }
    const get = vi.spyOn(api, 'get').mockResolvedValue(respuesta)

    // Act
    const productos = await servicio.obtenerTodos()

    // Assert
    expect(get).toHaveBeenCalledWith('/productos')
    expect(productos[0].especificaciones).toEqual({ Marca: 'Stanley' })
  })

  it('obtenerTodos devuelve una lista vacía si la base no tiene productos', async () => {
    // Arrange
    vi.spyOn(api, 'get').mockResolvedValue({ data: { _links: {} } })

    // Act
    const productos = await servicio.obtenerTodos()

    // Assert
    expect(productos).toEqual([])
  })

  it('buscarPorId pide /productos/{id}', async () => {
    // Arrange
    const get = vi.spyOn(api, 'get').mockResolvedValue({ data: { ...productoDeEjemplo, especificaciones: null } })

    // Act
    const producto = await servicio.buscarPorId('HER-MAR-010')

    // Assert
    expect(get).toHaveBeenCalledWith('/productos/HER-MAR-010')
    expect(producto.nombre).toBe('Martillo Carpintero 16oz')
  })

  it('crear envía un POST con el formato de la API', async () => {
    // Arrange
    const post = vi.spyOn(api, 'post').mockResolvedValue({ data: { ...productoDeEjemplo, especificaciones: '{"Marca":"Stanley"}' } })

    // Act
    await servicio.crear(productoDeEjemplo)

    // Assert
    expect(post).toHaveBeenCalledWith(
      '/productos',
      expect.objectContaining({
        id: 'HER-MAR-010',
        imagen: 'producto-generico.svg',
        especificaciones: '{"Marca":"Stanley"}',
      }),
    )
  })

  it('actualizar envía un PUT con el SKU en la ruta', async () => {
    // Arrange
    const put = vi.spyOn(api, 'put').mockResolvedValue({ data: { ...productoDeEjemplo, especificaciones: null } })

    // Act
    await servicio.actualizar('HER-MAR-010', productoDeEjemplo)

    // Assert
    expect(put).toHaveBeenCalledWith('/productos/HER-MAR-010', expect.objectContaining({ precio: 9990 }))
  })

  it('eliminar envía un DELETE', async () => {
    // Arrange
    const borrar = vi.spyOn(api, 'delete').mockResolvedValue({ status: 204 })

    // Act
    await servicio.eliminar('HER-MAR-010')

    // Assert
    expect(borrar).toHaveBeenCalledWith('/productos/HER-MAR-010')
  })
})
