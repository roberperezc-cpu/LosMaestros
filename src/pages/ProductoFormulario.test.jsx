import { fireEvent, render, screen } from '@testing-library/react'
import { MemoryRouter, Route, Routes } from 'react-router-dom'
import { describe, it, expect, vi } from 'vitest'
import ProductoFormulario from './ProductoFormulario'
import ProductoService from '../services/ProductoService'
import productos from '../data/productos'

function renderizar(ruta, props = {}) {
  return render(
    <MemoryRouter initialEntries={[ruta]}>
      <Routes>
        <Route path="/admin/productos/nuevo" element={<ProductoFormulario productos={productos} {...props} />} />
        <Route path="/admin/productos/:id/editar" element={<ProductoFormulario productos={productos} {...props} />} />
        <Route path="/admin" element={<p>Panel de administración</p>} />
      </Routes>
    </MemoryRouter>,
  )
}

function escribir(etiqueta, valor) {
  fireEvent.change(screen.getByLabelText(etiqueta), { target: { value: valor } })
}

describe('ProductoFormulario', () => {
  it('en /nuevo muestra el formulario de creación vacío', () => {
    // Arrange + Act
    renderizar('/admin/productos/nuevo')

    // Assert
    expect(screen.getByRole('heading', { name: 'Registrar Nuevo Producto' })).toBeInTheDocument()
    expect(screen.getByLabelText('Código SKU:')).toHaveValue('')
  })

  it('en /editar carga el producto desde la API y rellena el formulario', async () => {
    // Arrange
    ProductoService.buscarPorId.mockResolvedValueOnce(productos[1])

    // Act
    renderizar('/admin/productos/HER-TAL-042/editar')

    // Assert
    expect(await screen.findByDisplayValue('Taladro Percutor 710W Makita')).toBeInTheDocument()
    expect(ProductoService.buscarPorId).toHaveBeenCalledWith('HER-TAL-042')
    expect(screen.getByLabelText('Código SKU:')).toHaveAttribute('readonly')
  })

  it('al guardar un producto nuevo llama a onCrear y vuelve al panel', async () => {
    // Arrange
    const onCrear = vi.fn().mockResolvedValue()
    renderizar('/admin/productos/nuevo', { onCrear })

    // Act
    escribir('Código SKU:', 'HER-MAR-010')
    escribir('Nombre del producto:', 'Martillo Carpintero 16oz')
    escribir('Categoría:', 'herramientas-man')
    escribir('Precio (CLP):', '9990')
    escribir('Stock inicial:', '25')
    escribir('Stock mínimo:', '5')
    escribir('Ubicación en bodega:', 'Pasillo C - Estante 1')
    fireEvent.click(screen.getByRole('button', { name: 'Agregar Producto' }))

    // Assert
    expect(await screen.findByText('Panel de administración')).toBeInTheDocument()
    expect(onCrear).toHaveBeenCalledWith(expect.objectContaining({ id: 'HER-MAR-010' }))
  })

  it('al guardar una edición llama a onActualizar con el SKU y vuelve al panel', async () => {
    // Arrange
    ProductoService.buscarPorId.mockResolvedValueOnce(productos[0])
    const onActualizar = vi.fn().mockResolvedValue()
    renderizar('/admin/productos/MAT-CEM-001/editar', { onActualizar })
    await screen.findByDisplayValue('Saco de Cemento Melón 25kg')

    // Act
    escribir('Precio (CLP):', '5000')
    fireEvent.click(screen.getByRole('button', { name: 'Guardar cambios' }))

    // Assert
    expect(await screen.findByText('Panel de administración')).toBeInTheDocument()
    expect(onActualizar).toHaveBeenCalledWith('MAT-CEM-001', expect.objectContaining({ precio: 5000 }))
  })

  it('si la API no encuentra el producto muestra el error', async () => {
    // Arrange
    ProductoService.buscarPorId.mockRejectedValueOnce({
      response: { status: 404, data: { mensaje: 'Producto no encontrado: XXX-XXX-999' } },
    })

    // Act
    renderizar('/admin/productos/XXX-XXX-999/editar')

    // Assert
    expect(await screen.findByRole('alert')).toHaveTextContent('Producto no encontrado: XXX-XXX-999')
  })
})
