import { fireEvent, render, screen } from '@testing-library/react'
import { MemoryRouter } from 'react-router-dom'
import { describe, it, expect, vi, beforeEach } from 'vitest'
import App from '../App'

function renderizarEn(ruta) {
  return render(
    <MemoryRouter initialEntries={[ruta]}>
      <App />
    </MemoryRouter>,
  )
}

function escribir(etiqueta, valor) {
  fireEvent.change(screen.getByLabelText(etiqueta), { target: { value: valor } })
}

describe('Carrito de compras', () => {
  beforeEach(() => {
    localStorage.clear()
    vi.spyOn(window, 'alert').mockImplementation(() => {})
  })

  it('muestra un mensaje cuando el carrito está vacío', () => {
    // Arrange + Act
    renderizarEn('/carrito')

    // Assert
    expect(screen.getByText('Tu carrito está vacío.')).toBeInTheDocument()
  })

  it('agregar desde el catálogo actualiza el contador del menú', () => {
    // Arrange
    renderizarEn('/catalogo')
    const botones = screen.getAllByRole('button', { name: 'Agregar al carrito' })

    // Act
    fireEvent.click(botones[0])
    fireEvent.click(botones[0])

    // Assert
    expect(screen.getByRole('link', { name: 'Carrito (2)' })).toBeInTheDocument()
  })

  it('no permite agregar más unidades que el stock disponible', () => {
    // Arrange
    renderizarEn('/catalogo')
    const botones = screen.getAllByRole('button', { name: 'Agregar al carrito' })

    // Act: el taladro tiene 3 unidades en stock
    for (let i = 0; i < 4; i++) fireEvent.click(botones[1])

    // Assert
    expect(window.alert).toHaveBeenCalledWith('No hay más unidades disponibles de este producto')
    expect(screen.getByRole('link', { name: 'Carrito (3)' })).toBeInTheDocument()
  })

  it('permite aumentar la cantidad de un producto en el carrito', () => {
    // Arrange
    renderizarEn('/catalogo')
    fireEvent.click(screen.getAllByRole('button', { name: 'Agregar al carrito' })[0])
    fireEvent.click(screen.getByRole('link', { name: 'Carrito (1)' }))

    // Act
    fireEvent.click(
      screen.getByRole('button', { name: 'Aumentar cantidad de Saco de Cemento Melón 25kg' }),
    )

    // Assert
    expect(screen.getByRole('link', { name: 'Carrito (2)' })).toBeInTheDocument()
  })

  it('permite quitar un producto y deja el carrito vacío', () => {
    // Arrange
    renderizarEn('/catalogo')
    fireEvent.click(screen.getAllByRole('button', { name: 'Agregar al carrito' })[0])
    fireEvent.click(screen.getByRole('link', { name: 'Carrito (1)' }))

    // Act
    fireEvent.click(
      screen.getByRole('button', { name: 'Quitar Saco de Cemento Melón 25kg del carrito' }),
    )

    // Assert
    expect(screen.getByText('Tu carrito está vacío.')).toBeInTheDocument()
  })

  it('confirmar la compra descuenta el stock y vacía el carrito', () => {
    // Arrange
    renderizarEn('/catalogo')
    const botones = screen.getAllByRole('button', { name: 'Agregar al carrito' })
    fireEvent.click(botones[0])
    fireEvent.click(botones[0])
    fireEvent.click(screen.getByRole('link', { name: 'Carrito (2)' }))

    // Act
    escribir('Nombre completo:', 'Juan Pérez')
    escribir('RUT:', '12.345.678-5')
    escribir('Teléfono celular:', '+56 9 1234 5678')
    escribir('Tipo de entrega:', 'retiro')
    escribir('Método de pago:', 'transferencia')
    fireEvent.click(screen.getByRole('button', { name: 'Confirmar Compra' }))

    // Assert
    expect(screen.getByRole('heading', { name: 'Compra confirmada' })).toBeInTheDocument()
    expect(screen.getByRole('link', { name: 'Carrito' })).toBeInTheDocument()

    fireEvent.click(screen.getByRole('link', { name: 'Catálogo y Stock' }))
    expect(screen.getByText('140 unidades')).toBeInTheDocument()
  })
})
