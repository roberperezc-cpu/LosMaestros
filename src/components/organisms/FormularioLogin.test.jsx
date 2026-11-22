import { fireEvent, render, screen, waitFor } from '@testing-library/react'
import { describe, it, expect, vi, beforeEach } from 'vitest'
import FormularioLogin from './FormularioLogin'
import AuthService from '../../services/AuthService'
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

  it('muestra un mensaje cuando las credenciales son incorrectas', async () => {
    // Arrange (la API simulada rechaza y el usuario local tampoco coincide)
    const onLoginExitoso = vi.fn()
    render(<FormularioLogin onLoginExitoso={onLoginExitoso} />)

    // Act
    completarYEnviar('admin@losmaestros.cl', 'ClaveIncorrecta')

    // Assert
    expect(await screen.findByRole('alert')).toHaveTextContent('Correo o contraseña incorrectos.')
    expect(onLoginExitoso).not.toHaveBeenCalled()
    expect(obtenerSesion()).toBeNull()
  })

  it('con la API apagada inicia sesión con los usuarios locales', async () => {
    // Arrange
    const onLoginExitoso = vi.fn()
    render(<FormularioLogin onLoginExitoso={onLoginExitoso} />)

    // Act
    completarYEnviar('admin@losmaestros.cl', 'Admin123')

    // Assert
    await waitFor(() =>
      expect(onLoginExitoso).toHaveBeenCalledWith(expect.objectContaining({ rol: 'admin' })),
    )
    expect(obtenerSesion()).toMatchObject({ correo: 'admin@losmaestros.cl', rol: 'admin' })
    expect(obtenerSesion().token).toBeUndefined()
  })

  it('con la API disponible guarda la sesión con el token JWT', async () => {
    // Arrange
    AuthService.login.mockResolvedValueOnce({
      token: 'token-de-prueba',
      tipo: 'Bearer',
      expiraEnMinutos: 60,
      usuario: { id: 1, nombre: 'Administrador', correo: 'admin@losmaestros.cl', rol: 'ADMIN' },
    })
    const onLoginExitoso = vi.fn()
    render(<FormularioLogin onLoginExitoso={onLoginExitoso} />)

    // Act
    completarYEnviar('admin@losmaestros.cl', 'Admin123')

    // Assert
    await waitFor(() => expect(onLoginExitoso).toHaveBeenCalled())
    expect(obtenerSesion()).toMatchObject({ rol: 'admin', token: 'token-de-prueba' })
  })
})
