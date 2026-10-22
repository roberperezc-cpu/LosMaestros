import { fireEvent, render, screen } from '@testing-library/react'
import { MemoryRouter } from 'react-router-dom'
import { describe, it, expect, vi, beforeEach } from 'vitest'
import POS from './POS'
import productos from '../data/productos'

function renderPOS() {
  return render(
    <MemoryRouter>
      <POS productos={productos} />
    </MemoryRouter>,
  )
}

describe('POS', () => {
  beforeEach(() => {
    vi.spyOn(window, 'alert').mockImplementation(() => {})
  })

  it('agrega un producto al detalle de venta y acumula cantidades', () => {
    // Arrange
    renderPOS()
    const botonesAgregar = screen.getAllByRole('button', { name: '+ Agregar' })

    // Act
    fireEvent.click(botonesAgregar[0]) // Cemento
    fireEvent.click(botonesAgregar[0])

    // Assert
    expect(screen.getByText('Saco de Cemento Melón 25kg x 2')).toBeInTheDocument()
  })

  it('avisa cuando el producto no tiene stock', () => {
    // Arrange
    renderPOS()
    const botonesAgregar = screen.getAllByRole('button', { name: '+ Agregar' })

    // Act
    fireEvent.click(botonesAgregar[2]) // Tubo PVC (stock 0)

    // Assert
    expect(window.alert).toHaveBeenCalledWith('Producto sin stock disponible')
    expect(screen.getByText('No hay productos en la venta.')).toBeInTheDocument()
  })

  it('no permite superar el stock disponible', () => {
    // Arrange
    renderPOS()
    const botonesAgregar = screen.getAllByRole('button', { name: '+ Agregar' })

    // Act
    for (let i = 0; i < 4; i++) fireEvent.click(botonesAgregar[1]) // Taladro (stock 3)

    // Assert
    expect(window.alert).toHaveBeenCalledWith('No hay suficiente stock disponible')
    expect(screen.getByText('Taladro Percutor 710W Makita x 3')).toBeInTheDocument()
  })
})
