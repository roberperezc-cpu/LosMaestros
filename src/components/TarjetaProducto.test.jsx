import { render, screen } from '@testing-library/react'
import { MemoryRouter } from 'react-router-dom'
import { describe, it, expect } from 'vitest'
import TarjetaProducto from './TarjetaProducto'

const productoMock = {
  id: 'HER-TAL-042',
  nombre: 'Taladro Percutor 710W Makita',
  categoriaNombre: 'Herramientas Eléctricas',
  precio: 58990,
  stock: 3,
  stockMinimo: 5,
  imagen: 'taladro.jpg',
}

describe('TarjetaProducto', () => {
  it('muestra nombre, SKU y badge de Bajo Stock', () => {
    render(
      <MemoryRouter>
        <TarjetaProducto producto={productoMock} />
      </MemoryRouter>,
    )

    expect(screen.getByText('Taladro Percutor 710W Makita')).toBeInTheDocument()
    expect(screen.getByText('SKU: HER-TAL-042')).toBeInTheDocument()
    expect(screen.getByText('Bajo Stock')).toHaveClass('badge', 'stock-low')
  })

  it('el botón "Ver Detalle" lleva a /catalogo/:id', () => {
    render(
      <MemoryRouter>
        <TarjetaProducto producto={productoMock} />
      </MemoryRouter>,
    )

    expect(screen.getByRole('link', { name: 'Ver Detalle' })).toHaveAttribute(
      'href',
      '/catalogo/HER-TAL-042',
    )
  })
})
