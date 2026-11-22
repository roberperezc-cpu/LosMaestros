import { fireEvent, render, screen, waitFor } from '@testing-library/react'
import { MemoryRouter } from 'react-router-dom'
import { describe, it, expect, vi } from 'vitest'
import Admin from './Admin'
import productos from '../data/productos'

function renderizar(onEliminarProducto = vi.fn(), entrada = '/admin') {
  return render(
    <MemoryRouter initialEntries={[entrada]}>
      <Admin productos={productos} onEliminarProducto={onEliminarProducto} />
    </MemoryRouter>,
  )
}

describe('Admin', () => {
  it('muestra un enlace Editar y un botón Eliminar por cada producto', () => {
    // Arrange + Act
    renderizar()

    // Assert
    expect(screen.getAllByRole('link', { name: 'Editar' })).toHaveLength(4)
    expect(screen.getAllByRole('button', { name: 'Eliminar' })).toHaveLength(4)
    expect(screen.getAllByRole('link', { name: 'Editar' })[0]).toHaveAttribute(
      'href',
      '/admin/productos/MAT-CEM-001/editar',
    )
  })

  it('al confirmar, elimina el producto y muestra el mensaje', async () => {
    // Arrange
    const onEliminarProducto = vi.fn().mockResolvedValue()
    vi.spyOn(window, 'confirm').mockReturnValue(true)
    renderizar(onEliminarProducto)

    // Act
    fireEvent.click(screen.getAllByRole('button', { name: 'Eliminar' })[0])

    // Assert
    await waitFor(() => expect(onEliminarProducto).toHaveBeenCalledWith('MAT-CEM-001'))
    expect(await screen.findByRole('alert')).toHaveTextContent('eliminado')
  })

  it('si el usuario cancela la confirmación no elimina nada', () => {
    // Arrange
    const onEliminarProducto = vi.fn()
    vi.spyOn(window, 'confirm').mockReturnValue(false)
    renderizar(onEliminarProducto)

    // Act
    fireEvent.click(screen.getAllByRole('button', { name: 'Eliminar' })[0])

    // Assert
    expect(onEliminarProducto).not.toHaveBeenCalled()
  })

  it('muestra el error del servidor cuando no se puede eliminar', async () => {
    // Arrange
    const onEliminarProducto = vi.fn().mockRejectedValue({ response: { status: 403 } })
    vi.spyOn(window, 'confirm').mockReturnValue(true)
    renderizar(onEliminarProducto)

    // Act
    fireEvent.click(screen.getAllByRole('button', { name: 'Eliminar' })[0])

    // Assert
    expect(await screen.findByRole('alert')).toHaveTextContent('No tienes permisos')
  })

  it('muestra el mensaje que llega desde el formulario de producto', () => {
    // Arrange + Act
    renderizar(vi.fn(), { pathname: '/admin', state: { mensaje: 'Producto creado correctamente.' } })

    // Assert
    expect(screen.getByRole('alert')).toHaveTextContent('Producto creado correctamente.')
  })
})
