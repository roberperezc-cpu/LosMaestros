import { fireEvent, render, screen } from '@testing-library/react'
import { MemoryRouter } from 'react-router-dom'
import { describe, it, expect, vi, beforeEach } from 'vitest'
import POS from './POS'

function renderPOS() {
  return render(
    <MemoryRouter>
      <POS />
    </MemoryRouter>,
  )
}

describe('POS', () => {
  beforeEach(() => {
    vi.spyOn(window, 'alert').mockImplementation(() => {})
  })

  it('agrega un producto al detalle de venta y acumula cantidades', () => {
    renderPOS()
    expect(screen.getByText('No hay productos en la venta.')).toBeInTheDocument()

    const botonesAgregar = screen.getAllByRole('button', { name: '+ Agregar' })
    fireEvent.click(botonesAgregar[0]) // Cemento
    fireEvent.click(botonesAgregar[0])

    expect(screen.getByText('Saco de Cemento Melón 25kg x 2')).toBeInTheDocument()
  })

  it('avisa cuando el producto no tiene stock', () => {
    renderPOS()

    const botonesAgregar = screen.getAllByRole('button', { name: '+ Agregar' })
    fireEvent.click(botonesAgregar[2]) // Tubo PVC (stock 0)

    expect(window.alert).toHaveBeenCalledWith('Producto sin stock disponible')
    expect(screen.getByText('No hay productos en la venta.')).toBeInTheDocument()
  })

  it('no permite superar el stock disponible', () => {
    renderPOS()

    const botonesAgregar = screen.getAllByRole('button', { name: '+ Agregar' })
    for (let i = 0; i < 4; i++) fireEvent.click(botonesAgregar[1]) // Taladro (stock 3)

    expect(window.alert).toHaveBeenCalledWith('No hay suficiente stock disponible')
    expect(screen.getByText('Taladro Percutor 710W Makita x 3')).toBeInTheDocument()
  })
})
