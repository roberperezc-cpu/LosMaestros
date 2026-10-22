import { render, screen } from '@testing-library/react'
import { MemoryRouter, Routes, Route } from 'react-router-dom'
import { describe, it, expect, beforeEach } from 'vitest'
import RutaPrivada from './RutaPrivada'
import { guardarSesion } from '../utils/sesion'

function renderizarRutaAdmin() {
  return render(
    <MemoryRouter initialEntries={['/admin']}>
      <Routes>
        <Route
          path="/admin"
          element={
            <RutaPrivada rolRequerido="admin">
              <p>Contenido del panel</p>
            </RutaPrivada>
          }
        />
        <Route path="/login" element={<p>Pantalla de login</p>} />
        <Route path="/" element={<p>Pantalla de inicio</p>} />
      </Routes>
    </MemoryRouter>,
  )
}

describe('RutaPrivada', () => {
  beforeEach(() => {
    localStorage.clear()
  })

  it('redirige a /login cuando no hay sesión', () => {
    // Arrange + Act
    renderizarRutaAdmin()

    // Assert
    expect(screen.getByText('Pantalla de login')).toBeInTheDocument()
    expect(screen.queryByText('Contenido del panel')).not.toBeInTheDocument()
  })

  it('muestra el contenido cuando la sesión es de administrador', () => {
    // Arrange
    guardarSesion({ nombre: 'Administrador', rol: 'admin' })

    // Act
    renderizarRutaAdmin()

    // Assert
    expect(screen.getByText('Contenido del panel')).toBeInTheDocument()
  })

  it('redirige al inicio cuando la sesión es de otro rol', () => {
    // Arrange
    guardarSesion({ nombre: 'Constructora Elqui', rol: 'contratista' })

    // Act
    renderizarRutaAdmin()

    // Assert
    expect(screen.getByText('Pantalla de inicio')).toBeInTheDocument()
  })
})
