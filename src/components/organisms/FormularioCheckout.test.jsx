import { fireEvent, render, screen } from '@testing-library/react'
import { describe, it, expect, vi, beforeEach } from 'vitest'
import FormularioCheckout from './FormularioCheckout'

function escribir(etiqueta, valor) {
  fireEvent.change(screen.getByLabelText(etiqueta), { target: { value: valor } })
}

function enviar() {
  fireEvent.click(screen.getByRole('button', { name: 'Confirmar Compra' }))
}

describe('FormularioCheckout', () => {
  beforeEach(() => {
    localStorage.clear()
  })

  it('muestra errores y no confirma cuando el formulario está vacío', () => {
    // Arrange
    const onConfirmar = vi.fn()
    render(<FormularioCheckout onConfirmar={onConfirmar} />)

    // Act
    enviar()

    // Assert
    expect(screen.getByText('Selecciona cómo quieres recibir tu pedido.')).toBeInTheDocument()
    expect(screen.getByText('Selecciona un método de pago.')).toBeInTheDocument()
    expect(onConfirmar).not.toHaveBeenCalled()
  })

  it('muestra los campos de dirección solo con despacho a domicilio', () => {
    // Arrange
    render(<FormularioCheckout onConfirmar={vi.fn()} />)

    // Act
    const antes = screen.queryByLabelText('Dirección:')
    escribir('Tipo de entrega:', 'despacho')
    const despues = screen.queryByLabelText('Dirección:')

    // Assert
    expect(antes).toBeNull()
    expect(despues).toBeInTheDocument()
  })

  it('con retiro en tienda y datos válidos llama a onConfirmar', () => {
    // Arrange
    const onConfirmar = vi.fn()
    render(<FormularioCheckout onConfirmar={onConfirmar} />)

    // Act
    escribir('Nombre completo:', 'Juan Pérez')
    escribir('RUT:', '12.345.678-5')
    escribir('Teléfono celular:', '+56 9 1234 5678')
    escribir('Tipo de entrega:', 'retiro')
    escribir('Método de pago:', 'transferencia')
    enviar()

    // Assert
    expect(onConfirmar).toHaveBeenCalledWith(
      expect.objectContaining({ tipoEntrega: 'retiro', metodoPago: 'transferencia' }),
    )
  })

  it('precarga los datos del usuario con sesión iniciada', () => {
    // Arrange
    localStorage.setItem(
      'sesionLosMaestros',
      JSON.stringify({ nombre: 'Constructora Elqui', rut: '12.345.678-5', telefono: '+56 9 8765 4321' }),
    )

    // Act
    render(<FormularioCheckout onConfirmar={vi.fn()} />)

    // Assert
    expect(screen.getByLabelText('Nombre completo:')).toHaveValue('Constructora Elqui')
    expect(screen.getByLabelText('RUT:')).toHaveValue('12.345.678-5')
  })
})
