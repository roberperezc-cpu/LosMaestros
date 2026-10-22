import { fireEvent, render, screen } from '@testing-library/react'
import { describe, it, expect, vi, beforeEach } from 'vitest'
import FormularioRegistro from './FormularioRegistro'
import { obtenerSesion } from '../../utils/sesion'

function escribir(etiqueta, valor) {
  fireEvent.change(screen.getByLabelText(etiqueta), { target: { value: valor } })
}

function completarFormulario() {
  escribir('Nombre completo o razón social:', 'Juan Pérez')
  escribir('RUT:', '9.876.543-3')
  escribir('Correo electrónico:', 'juan@correo.cl')
  escribir('Teléfono celular:', '+56 9 1234 5678')
  escribir('Tipo de cliente:', 'particular')
  escribir('Región:', 'coquimbo')
  escribir('Comuna:', 'La Serena')
  escribir('Contraseña:', 'Clave123')
  escribir('Confirmar contraseña:', 'Clave123')
  fireEvent.click(screen.getByLabelText('Acepto los términos y condiciones'))
}

function enviar() {
  fireEvent.click(screen.getByRole('button', { name: 'Crear Cuenta' }))
}

describe('FormularioRegistro', () => {
  beforeEach(() => {
    localStorage.clear()
  })

  it('muestra errores y no registra cuando el formulario está vacío', () => {
    // Arrange
    const onRegistroExitoso = vi.fn()
    render(<FormularioRegistro onRegistroExitoso={onRegistroExitoso} />)

    // Act
    enviar()

    // Assert
    expect(screen.getByText('El RUT es obligatorio.')).toBeInTheDocument()
    expect(screen.getByText('Debes aceptar los términos y condiciones.')).toBeInTheDocument()
    expect(onRegistroExitoso).not.toHaveBeenCalled()
  })

  it('la comuna está deshabilitada hasta elegir una región', () => {
    // Arrange
    render(<FormularioRegistro onRegistroExitoso={vi.fn()} />)

    // Act
    const antes = screen.getByLabelText('Comuna:').disabled
    escribir('Región:', 'coquimbo')
    const despues = screen.getByLabelText('Comuna:').disabled

    // Assert
    expect(antes).toBe(true)
    expect(despues).toBe(false)
    expect(screen.getByRole('option', { name: 'Ovalle' })).toBeInTheDocument()
  })

  it('con datos válidos registra al usuario, abre la sesión y avisa al padre', () => {
    // Arrange
    const onRegistroExitoso = vi.fn()
    render(<FormularioRegistro onRegistroExitoso={onRegistroExitoso} />)

    // Act
    completarFormulario()
    enviar()

    // Assert
    expect(onRegistroExitoso).toHaveBeenCalledWith(expect.objectContaining({ rol: 'cliente' }))
    expect(obtenerSesion()).toMatchObject({ correo: 'juan@correo.cl', comuna: 'La Serena' })
  })
})
