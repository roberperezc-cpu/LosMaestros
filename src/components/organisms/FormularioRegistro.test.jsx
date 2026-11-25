import { fireEvent, render, screen, waitFor } from '@testing-library/react'
import { describe, it, expect, vi, beforeEach } from 'vitest'
import FormularioRegistro from './FormularioRegistro'
import AuthService from '../../services/AuthService'
import { obtenerSesion } from '../../utils/sesion'

function escribir(etiqueta, valor) {
  fireEvent.change(screen.getByLabelText(etiqueta), { target: { value: valor } })
}

function completarFormulario() {
  escribir('Nombre completo o razón social:', 'Juan Pérez')
  escribir('RUT:', '9876543-3')
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

const respuestaDeLaApi = {
  token: 'token-de-prueba',
  tipo: 'Bearer',
  expiraEnMinutos: 60,
  usuario: { id: 7, nombre: 'Juan Pérez', correo: 'juan@correo.cl', rol: 'USER' },
  cliente: { rut: '9.876.543-3', telefono: '+56 9 1234 5678', tipoCliente: 'particular', region: 'coquimbo', comuna: 'La Serena' },
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
    expect(AuthService.registro).not.toHaveBeenCalled()
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

  it('con datos válidos envía el registro a la API, abre la sesión con el token y avisa al padre', async () => {
    // Arrange
    AuthService.registro.mockResolvedValueOnce(respuestaDeLaApi)
    const onRegistroExitoso = vi.fn()
    render(<FormularioRegistro onRegistroExitoso={onRegistroExitoso} />)

    // Act
    completarFormulario()
    enviar()

    // Assert
    await waitFor(() =>
      expect(onRegistroExitoso).toHaveBeenCalledWith(expect.objectContaining({ rol: 'cliente' })),
    )
    expect(AuthService.registro).toHaveBeenCalledWith(
      expect.objectContaining({ correo: 'juan@correo.cl', rut: '9.876.543-3', tipoCliente: 'particular' }),
    )
    expect(obtenerSesion()).toMatchObject({ correo: 'juan@correo.cl', comuna: 'La Serena', token: 'token-de-prueba' })
  })

  it('muestra el error del servidor cuando el correo o el RUT ya existen', async () => {
    // Arrange
    AuthService.registro.mockRejectedValueOnce({
      response: { status: 409, data: { mensaje: 'Ya existe una cuenta con ese correo.' } },
    })
    const onRegistroExitoso = vi.fn()
    render(<FormularioRegistro onRegistroExitoso={onRegistroExitoso} />)

    // Act
    completarFormulario()
    enviar()

    // Assert
    expect(await screen.findByRole('alert')).toHaveTextContent('Ya existe una cuenta con ese correo.')
    expect(onRegistroExitoso).not.toHaveBeenCalled()
    expect(obtenerSesion()).toBeNull()
  })

  it('si no hay conexión con el servidor avisa y no crea la cuenta', async () => {
    // Arrange (la API simulada rechaza por defecto, como si el backend estuviera apagado)
    const onRegistroExitoso = vi.fn()
    render(<FormularioRegistro onRegistroExitoso={onRegistroExitoso} />)

    // Act
    completarFormulario()
    enviar()

    // Assert
    expect(await screen.findByRole('alert')).toHaveTextContent('No se pudo conectar con el servidor')
    expect(onRegistroExitoso).not.toHaveBeenCalled()
  })
})
