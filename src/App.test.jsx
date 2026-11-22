import { fireEvent, render, screen } from '@testing-library/react'
import { MemoryRouter } from 'react-router-dom'
import { describe, it, expect, vi, beforeEach } from 'vitest'
import App from './App'
import ProductoService from './services/ProductoService'
import productosLocales from './data/productos'
import { guardarSesion } from './utils/sesion'

function escribir(etiqueta, valor) {
  fireEvent.change(screen.getByLabelText(etiqueta), { target: { value: valor } })
}

function renderizarEn(ruta) {
  return render(
    <MemoryRouter initialEntries={[ruta]}>
      <App />
    </MemoryRouter>,
  )
}

describe('App', () => {
  beforeEach(() => {
    localStorage.clear()
  })

  it('al cargar muestra los productos que devuelve la API', async () => {
    // Arrange
    ProductoService.obtenerTodos.mockResolvedValueOnce([
      { ...productosLocales[0], id: 'API-PRO-001', nombre: 'Producto desde la API' },
    ])

    // Act
    renderizarEn('/catalogo')

    // Assert
    expect(await screen.findByText('Producto desde la API')).toBeInTheDocument()
    expect(screen.getAllByRole('article')).toHaveLength(1)
  })

  it('con la API apagada sigue mostrando los productos locales', () => {
    // Arrange + Act (obtenerTodos rechaza por defecto en las pruebas)
    renderizarEn('/catalogo')

    // Assert
    expect(screen.getAllByRole('article')).toHaveLength(4)
  })

  it('un producto creado en el panel admin se guarda en la API y aparece en el catálogo', async () => {
    // Arrange
    guardarSesion({ nombre: 'Administrador', rol: 'admin' })
    ProductoService.crear.mockImplementationOnce(async (producto) => producto)
    renderizarEn('/admin')

    // Act
    fireEvent.click(screen.getByRole('link', { name: '+ Agregar producto' }))
    escribir('Código SKU:', 'HER-MAR-010')
    escribir('Nombre del producto:', 'Martillo Carpintero 16oz')
    escribir('Categoría:', 'herramientas-man')
    escribir('Precio (CLP):', '9990')
    escribir('Stock inicial:', '25')
    escribir('Stock mínimo:', '5')
    escribir('Ubicación en bodega:', 'Pasillo C - Estante 1')
    fireEvent.click(screen.getByRole('button', { name: 'Agregar Producto' }))

    // Assert
    expect(await screen.findByText('Producto creado correctamente.')).toBeInTheDocument()
    expect(ProductoService.crear).toHaveBeenCalledWith(expect.objectContaining({ id: 'HER-MAR-010' }))

    fireEvent.click(screen.getByRole('link', { name: 'Catálogo y Stock' }))
    expect(screen.getByText('Martillo Carpintero 16oz')).toBeInTheDocument()
    expect(screen.getAllByRole('article')).toHaveLength(5)
  })

  it('eliminar un producto en el panel lo borra en la API y lo quita del inventario', async () => {
    // Arrange
    guardarSesion({ nombre: 'Administrador', rol: 'admin' })
    ProductoService.eliminar.mockResolvedValueOnce()
    vi.spyOn(window, 'confirm').mockReturnValue(true)
    renderizarEn('/admin')

    // Act
    fireEvent.click(screen.getAllByRole('button', { name: 'Eliminar' })[0])

    // Assert
    expect(await screen.findByText('Producto "Saco de Cemento Melón 25kg" eliminado.')).toBeInTheDocument()
    expect(ProductoService.eliminar).toHaveBeenCalledWith('MAT-CEM-001')
    expect(screen.getByRole('heading', { name: 'Inventario Actual (3 productos)' })).toBeInTheDocument()
  })

  it('sin sesión, /admin redirige al login', () => {
    // Arrange + Act
    renderizarEn('/admin')

    // Assert
    expect(screen.getByRole('heading', { name: 'Portal Contratistas' })).toBeInTheDocument()
  })

  it('sin sesión, el formulario de producto también redirige al login', () => {
    // Arrange + Act
    renderizarEn('/admin/productos/nuevo')

    // Assert
    expect(screen.getByRole('heading', { name: 'Portal Contratistas' })).toBeInTheDocument()
  })
})
