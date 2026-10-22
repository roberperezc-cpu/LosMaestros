import { fireEvent, render, screen } from '@testing-library/react'
import { describe, it, expect, vi } from 'vitest'
import FormularioProducto from './FormularioProducto'
import productos from '../../data/productos'

function escribir(etiqueta, valor) {
  fireEvent.change(screen.getByLabelText(etiqueta), { target: { value: valor } })
}

function completarFormulario(sku = 'HER-MAR-010') {
  escribir('Código SKU:', sku)
  escribir('Nombre del producto:', 'Martillo Carpintero 16oz')
  escribir('Categoría:', 'herramientas-man')
  escribir('Precio (CLP):', '9990')
  escribir('Stock inicial:', '25')
  escribir('Stock mínimo:', '5')
  escribir('Ubicación en bodega:', 'Pasillo C - Estante 1')
}

function enviar() {
  fireEvent.click(screen.getByRole('button', { name: 'Agregar Producto' }))
}

describe('FormularioProducto', () => {
  it('muestra errores y no agrega nada cuando el formulario está vacío', () => {
    // Arrange
    const onAgregarProducto = vi.fn()
    render(<FormularioProducto productos={productos} onAgregarProducto={onAgregarProducto} />)

    // Act
    enviar()

    // Assert
    expect(screen.getByText('El SKU es obligatorio.')).toBeInTheDocument()
    expect(screen.getByText('Selecciona una categoría.')).toBeInTheDocument()
    expect(onAgregarProducto).not.toHaveBeenCalled()
  })

  it('agrega el producto, muestra confirmación y limpia el formulario', () => {
    // Arrange
    const onAgregarProducto = vi.fn()
    render(<FormularioProducto productos={productos} onAgregarProducto={onAgregarProducto} />)

    // Act
    completarFormulario()
    enviar()

    // Assert
    expect(onAgregarProducto).toHaveBeenCalledWith(
      expect.objectContaining({ id: 'HER-MAR-010', precio: 9990 }),
    )
    expect(screen.getByRole('alert')).toHaveTextContent('agregado al catálogo')
    expect(screen.getByLabelText('Código SKU:')).toHaveValue('')
  })

  it('rechaza un SKU repetido', () => {
    // Arrange
    const onAgregarProducto = vi.fn()
    render(<FormularioProducto productos={productos} onAgregarProducto={onAgregarProducto} />)

    // Act
    completarFormulario('MAT-CEM-001')
    enviar()

    // Assert
    expect(screen.getByText('Ya existe un producto con ese SKU.')).toBeInTheDocument()
    expect(onAgregarProducto).not.toHaveBeenCalled()
  })
})
