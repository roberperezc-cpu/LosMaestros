import { fireEvent, render, screen, waitFor } from '@testing-library/react'
import { MemoryRouter } from 'react-router-dom'
import { describe, it, expect, vi } from 'vitest'
import FormularioProducto from './FormularioProducto'
import productos from '../../data/productos'

function renderizar(props) {
  return render(
    <MemoryRouter>
      <FormularioProducto productos={productos} {...props} />
    </MemoryRouter>,
  )
}

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

function enviar(nombre = 'Agregar Producto') {
  fireEvent.click(screen.getByRole('button', { name: nombre }))
}

describe('FormularioProducto', () => {
  it('muestra errores y no guarda nada cuando el formulario está vacío', () => {
    // Arrange
    const onGuardar = vi.fn()
    renderizar({ onGuardar })

    // Act
    enviar()

    // Assert
    expect(screen.getByText('El SKU es obligatorio.')).toBeInTheDocument()
    expect(screen.getByText('Selecciona una categoría.')).toBeInTheDocument()
    expect(onGuardar).not.toHaveBeenCalled()
  })

  it('con datos válidos llama a onGuardar con el producto', async () => {
    // Arrange
    const onGuardar = vi.fn().mockResolvedValue()
    renderizar({ onGuardar })

    // Act
    completarFormulario()
    enviar()

    // Assert
    await waitFor(() =>
      expect(onGuardar).toHaveBeenCalledWith(
        expect.objectContaining({ id: 'HER-MAR-010', precio: 9990 }),
      ),
    )
  })

  it('rechaza un SKU repetido', () => {
    // Arrange
    const onGuardar = vi.fn()
    renderizar({ onGuardar })

    // Act
    completarFormulario('MAT-CEM-001')
    enviar()

    // Assert
    expect(screen.getByText('Ya existe un producto con ese SKU.')).toBeInTheDocument()
    expect(onGuardar).not.toHaveBeenCalled()
  })

  it('muestra el error que devuelve el servidor', async () => {
    // Arrange
    const onGuardar = vi.fn().mockRejectedValue({
      response: { status: 409, data: { mensaje: 'Ya existe un producto con ese SKU.' } },
    })
    renderizar({ onGuardar })

    // Act
    completarFormulario()
    enviar()

    // Assert
    expect(await screen.findByRole('alert')).toHaveTextContent('Ya existe un producto con ese SKU.')
  })

  it('al editar rellena los datos y no permite cambiar el SKU', () => {
    // Arrange
    const onGuardar = vi.fn()

    // Act
    renderizar({ onGuardar, productoInicial: productos[0] })

    // Assert
    expect(screen.getByRole('heading', { name: 'Editar Producto' })).toBeInTheDocument()
    expect(screen.getByLabelText('Código SKU:')).toHaveValue('MAT-CEM-001')
    expect(screen.getByLabelText('Código SKU:')).toHaveAttribute('readonly')
    expect(screen.getByLabelText('Precio (CLP):')).toHaveValue(4890)
  })

  it('al editar guarda los cambios y conserva las especificaciones', async () => {
    // Arrange
    const onGuardar = vi.fn().mockResolvedValue()
    renderizar({ onGuardar, productoInicial: productos[0] })

    // Act
    escribir('Precio (CLP):', '5000')
    enviar('Guardar cambios')

    // Assert
    await waitFor(() =>
      expect(onGuardar).toHaveBeenCalledWith(
        expect.objectContaining({
          id: 'MAT-CEM-001',
          precio: 5000,
          especificaciones: expect.objectContaining({ Peso: '25 kg' }),
        }),
      ),
    )
  })
})
