import { render, screen } from '@testing-library/react'
import { MemoryRouter } from 'react-router-dom'
import { describe, it, expect, beforeEach } from 'vitest'
import App from '../App'
import { autenticar, guardarSesion } from '../utils/sesion'

function renderizarEn(ruta) {
  return render(
    <MemoryRouter initialEntries={[ruta]}>
      <App />
    </MemoryRouter>,
  )
}

describe('Perfil', () => {
  beforeEach(() => {
    localStorage.clear()
  })

  it('muestra los datos del usuario con sesión iniciada', () => {
    // Arrange
    guardarSesion(autenticar('contratista@losmaestros.cl', 'Maestro123'))

    // Act
    renderizarEn('/perfil')

    // Assert
    expect(screen.getByRole('heading', { name: 'Constructora Elqui' })).toBeInTheDocument()
    expect(screen.getByText('12.345.678-5')).toBeInTheDocument()
    expect(screen.getByText('Región de Coquimbo')).toBeInTheDocument()
  })

  it('sin sesión redirige al login', () => {
    // Arrange + Act
    renderizarEn('/perfil')

    // Assert
    expect(screen.getByRole('heading', { name: 'Portal Contratistas' })).toBeInTheDocument()
  })

  it('el menú muestra "Mi Perfil" solo con sesión', () => {
    // Arrange
    guardarSesion(autenticar('admin@losmaestros.cl', 'Admin123'))

    // Act
    renderizarEn('/')

    // Assert
    expect(screen.getByRole('link', { name: 'Mi Perfil' })).toBeInTheDocument()
  })
})
