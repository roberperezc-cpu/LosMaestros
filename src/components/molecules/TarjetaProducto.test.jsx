import { fireEvent, render, screen } from '@testing-library/react'
import { MemoryRouter } from 'react-router-dom'
import { describe, it, expect, vi } from 'vitest'
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

function renderizarTarjeta() {
  return render(
    <MemoryRouter>
      <TarjetaProducto producto={productoMock} />
    </MemoryRouter>,
  )
}

describe('TarjetaProducto', () => {
  it('muestra nombre, SKU y badge de Bajo Stock', () => {
    // Arrange + Act
    renderizarTarjeta()

    // Assert
    expect(screen.getByText('Taladro Percutor 710W Makita')).toBeInTheDocument()
    expect(screen.getByText('SKU: HER-TAL-042')).toBeInTheDocument()
    expect(screen.getByText('Bajo Stock')).toHaveClass('badge', 'stock-low')
  })

  it('el botón "Ver Detalle" lleva a /catalogo/:id', () => {
    // Arrange + Act
    renderizarTarjeta()

    // Assert
    expect(screen.getByRole('link', { name: 'Ver Detalle' })).toHaveAttribute(
      'href',
      '/catalogo/HER-TAL-042',
    )
  })
})

describe('TarjetaProducto (carrito)', () => {
  it('el botón "Agregar al carrito" llama a la función con el producto', () => {
    // Arrange
    const onAgregar = vi.fn()
    render(
      <MemoryRouter>
        <TarjetaProducto producto={productoMock} onAgregarAlCarrito={onAgregar} />
      </MemoryRouter>,
    )

    // Act
    fireEvent.click(screen.getByRole('button', { name: 'Agregar al carrito' }))

    // Assert
    expect(onAgregar).toHaveBeenCalledWith(productoMock)
  })

  it('con stock 0 el botón está deshabilitado', () => {
    // Arrange
    render(
      <MemoryRouter>
        <TarjetaProducto
          producto={{ ...productoMock, stock: 0 }}
          onAgregarAlCarrito={vi.fn()}
        />
      </MemoryRouter>,
    )

    // Act
    const boton = screen.getByRole('button', { name: 'Sin stock' })

    // Assert
    expect(boton).toBeDisabled()
  })
})
