import { fireEvent, render, screen } from '@testing-library/react'
import { MemoryRouter } from 'react-router-dom'
import { describe, it, expect, vi, beforeEach } from 'vitest'
import App from '../App'
import PedidoService from '../services/PedidoService'
import ProductoService from '../services/ProductoService'
import productos from '../data/productos'
import { guardarSesion } from '../utils/sesion'

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

  it('sin sesión con token no deja confirmar y pide iniciar sesión', () => {
    // Arrange
    renderizarEn('/catalogo')
    fireEvent.click(screen.getAllByRole('button', { name: 'Agregar al carrito' })[0])

    // Act
    fireEvent.click(screen.getByRole('link', { name: 'Carrito (1)' }))

    // Assert
    expect(screen.getByRole('alert')).toHaveTextContent('debes iniciar sesión')
    expect(screen.queryByRole('button', { name: 'Confirmar Compra' })).not.toBeInTheDocument()
    expect(screen.getByRole('link', { name: 'Iniciar sesión' })).toBeInTheDocument()
  })

  it('confirmar la compra la envía a la API, vacía el carrito y muestra el stock actualizado', async () => {
    // Arrange
    guardarSesion({ nombre: 'Juan Pérez', correo: 'juan@correo.cl', rol: 'cliente', token: 'token-de-prueba' })
    PedidoService.confirmar.mockResolvedValueOnce({
      numeroPedido: 'PED-261123-043015-47',
      fecha: '2026-11-23T04:30:15',
      total: 9780,
      tipoEntrega: 'retiro',
      metodoPago: 'transferencia',
      direccionEntrega: null,
      lineas: [
        { productoId: 'MAT-CEM-001', nombre: 'Saco de Cemento Melón 25kg', cantidad: 2, precioUnitario: 4890, subtotal: 9780 },
      ],
    })
    renderizarEn('/catalogo')
    const botones = screen.getAllByRole('button', { name: 'Agregar al carrito' })
    fireEvent.click(botones[0])
    fireEvent.click(botones[0])
    fireEvent.click(screen.getByRole('link', { name: 'Carrito (2)' }))
    // Después de confirmar, la aplicación vuelve a pedir el catálogo: ahora con el stock descontado.
    ProductoService.obtenerTodos.mockResolvedValueOnce([{ ...productos[0], stock: 140 }, productos[1], productos[2], productos[3]])

    // Act
    escribir('Nombre completo:', 'Juan Pérez')
    escribir('RUT:', '12.345.678-5')
    escribir('Teléfono celular:', '+56 9 1234 5678')
    escribir('Tipo de entrega:', 'retiro')
    escribir('Método de pago:', 'transferencia')
    fireEvent.click(screen.getByRole('button', { name: 'Confirmar Compra' }))

    // Assert
    expect(await screen.findByRole('heading', { name: 'Compra confirmada' })).toBeInTheDocument()
    expect(screen.getByText('PED-261123-043015-47')).toBeInTheDocument()
    expect(PedidoService.confirmar).toHaveBeenCalledWith({
      tipoEntrega: 'retiro',
      metodoPago: 'transferencia',
      direccionEntrega: null,
      items: [{ productoId: 'MAT-CEM-001', cantidad: 2 }],
    })
    expect(screen.getByRole('link', { name: 'Carrito' })).toBeInTheDocument()

    fireEvent.click(screen.getByRole('link', { name: 'Catálogo y Stock' }))
    expect(await screen.findByText('140 unidades')).toBeInTheDocument()
  })

  it('si la API rechaza la compra muestra el motivo y conserva el carrito', async () => {
    // Arrange
    guardarSesion({ nombre: 'Juan Pérez', correo: 'juan@correo.cl', rol: 'cliente', token: 'token-de-prueba' })
    PedidoService.confirmar.mockRejectedValueOnce({
      response: { status: 409, data: { mensaje: 'Stock insuficiente de "Taladro Percutor 710W Makita": quedan 1 unidades.' } },
    })
    renderizarEn('/catalogo')
    fireEvent.click(screen.getAllByRole('button', { name: 'Agregar al carrito' })[1])
    fireEvent.click(screen.getByRole('link', { name: 'Carrito (1)' }))

    // Act
    escribir('Nombre completo:', 'Juan Pérez')
    escribir('RUT:', '12.345.678-5')
    escribir('Teléfono celular:', '+56 9 1234 5678')
    escribir('Tipo de entrega:', 'retiro')
    escribir('Método de pago:', 'efectivo')
    fireEvent.click(screen.getByRole('button', { name: 'Confirmar Compra' }))

    // Assert
    expect(await screen.findByRole('alert')).toHaveTextContent('Stock insuficiente')
    expect(screen.getByRole('link', { name: 'Carrito (1)' })).toBeInTheDocument()
    expect(screen.queryByRole('heading', { name: 'Compra confirmada' })).not.toBeInTheDocument()
  })
})
