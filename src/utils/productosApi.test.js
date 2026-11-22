import { describe, it, expect } from 'vitest'
import { ARCHIVO_IMAGEN_GENERICA, desdeApi, extraerLista, haciaApi, resolverImagen } from './productosApi'

const productoApi = {
  id: 'HER-TAL-042',
  nombre: 'Taladro Percutor 710W Makita',
  categoria: 'herramientas-elec',
  categoriaNombre: 'Herramientas Eléctricas',
  precio: 58990,
  stock: 3,
  stockMinimo: 5,
  ubicacion: 'Pasillo A - Estante 4',
  imagen: 'taladro.jpg',
  especificaciones: '{"Marca":"Makita","Potencia":"710W"}',
  _links: { self: { href: 'http://localhost:8080/api/productos/HER-TAL-042' } },
}

describe('extraerLista', () => {
  it('saca los productos de la respuesta HAL (_embedded)', () => {
    // Arrange
    const datos = { _embedded: { productos: [productoApi] }, _links: {} }

    // Act
    const lista = extraerLista(datos)

    // Assert
    expect(lista).toHaveLength(1)
  })

  it('devuelve una lista vacía cuando no hay productos (no viene _embedded)', () => {
    // Arrange
    const datos = { _links: {} }

    // Act
    const lista = extraerLista(datos)

    // Assert
    expect(lista).toEqual([])
  })
})

describe('desdeApi', () => {
  it('convierte las especificaciones de texto JSON a objeto y deja fuera los _links', () => {
    // Arrange + Act
    const producto = desdeApi(productoApi)

    // Assert
    expect(producto.especificaciones).toEqual({ Marca: 'Makita', Potencia: '710W' })
    expect(producto).not.toHaveProperty('_links')
  })

  it('convierte el nombre de archivo de la imagen en la imagen del proyecto', () => {
    // Arrange + Act
    const producto = desdeApi(productoApi)

    // Assert
    expect(producto.imagen).toContain('taladro')
    expect(producto.imagenArchivo).toBe('taladro.jpg')
  })

  it('tolera especificaciones inválidas o ausentes y usa la imagen genérica', () => {
    // Arrange
    const sinDatos = { ...productoApi, especificaciones: 'esto no es json', imagen: null }

    // Act
    const producto = desdeApi(sinDatos)

    // Assert
    expect(producto.especificaciones).toEqual({})
    expect(producto.imagen).toBe(resolverImagen(ARCHIVO_IMAGEN_GENERICA))
  })
})

describe('haciaApi', () => {
  it('guarda las especificaciones como texto JSON y conserva el archivo de la imagen', () => {
    // Arrange
    const producto = desdeApi(productoApi)

    // Act
    const datos = haciaApi(producto)

    // Assert
    expect(datos.especificaciones).toBe('{"Marca":"Makita","Potencia":"710W"}')
    expect(datos.imagen).toBe('taladro.jpg')
  })

  it('sin especificaciones envía null y la imagen genérica', () => {
    // Arrange
    const producto = { ...desdeApi(productoApi), especificaciones: {}, imagenArchivo: null }

    // Act
    const datos = haciaApi(producto)

    // Assert
    expect(datos.especificaciones).toBeNull()
    expect(datos.imagen).toBe('producto-generico.svg')
  })
})

describe('resolverImagen', () => {
  it('devuelve la imagen genérica si el archivo no existe', () => {
    // Arrange
    const archivo = 'no-existe.png'

    // Act
    const imagen = resolverImagen(archivo)

    // Assert (Vite puede incrustar el SVG como data URI, así que se compara con la imagen genérica real)
    expect(imagen).toBe(resolverImagen(ARCHIVO_IMAGEN_GENERICA))
    expect(imagen).not.toBe(resolverImagen('taladro.jpg'))
  })
})
