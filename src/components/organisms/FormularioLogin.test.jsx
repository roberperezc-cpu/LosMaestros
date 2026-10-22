import { fireEvent, render, screen } from '@testing-library/react'
import { describe, it, expect, vi, beforeEach } from 'vitest'
import FormularioLogin from './FormularioLogin'
import { obtenerSesion } from '../../utils/sesion'

function completarYEnviar(correo, password) {
  fireEvent.change(screen.getByLabelText('Correo electrónico:'), { target: { value: correo } })
  fireEvent.change(screen.getByLabelText('Contraseña:'), { target: { value: password } })
  fireEvent.click(screen.getByRole('button', { name: 'Ingresar al Portal' }))
}

describe('FormularioLogin', () => {
  beforeEach(() => {
    localStorage.clear()
  })

  it('muestra errores de validación cuando los campos están vacíos', () => {
    // Arrange
    const onLoginExitoso = vi.fn()
    render(<FormularioLogin onLoginExitoso={onLoginExitoso} />)

    // Act
    fireEvent.click(screen.getByRole('button', { name: 'Ingresar al Portal' }))

    // Assert
    expect(screen.getByText('El correo es obligatorio.')).toBeInTheDocument()
    expect(screen.getByText('La contraseña es obligatoria.')).toBeInTheDocument()
    expect(onLoginExitoso).not.toHaveBeenCalled()
  })

  it('muestra un mensaje cuando las credenciales son incorrectas', () => {
    // Arrange
    const onLoginExitoso = vi.fn()
    render(<FormularioLogin onLoginExitoso={onLoginExitoso} />)

    // Act
    completarYEnviar('admin@losmaestros.cl', 'ClaveIncorrecta')

    // Assert
    expect(screen.getByRole('alert')).toHaveTextContent('Correo o contraseña incorrectos.')
    expect(onLoginExitoso).not.toHaveBeenCalled()
    expect(obtenerSesion()).toBeNull()
  })

  it('con credenciales correctas guarda la sesión y avisa al padre', () => {
    // Arrange
    const onLoginExitoso = vi.fn()
    render(<FormularioLogin onLoginExitoso={onLoginExitoso} />)

    // Act
    completarYEnviar('admin@losmaestros.cl', 'Admin123')

    // Assert
    expect(onLoginExitoso).toHaveBeenCalledWith(expect.objectContaining({ rol: 'admin' }))
    expect(obtenerSesion()).toMatchObject({ correo: 'admin@losmaestros.cl', rol: 'admin' })
  })
})
