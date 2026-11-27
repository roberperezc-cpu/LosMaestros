import { render, screen } from '@testing-library/react'
import { MemoryRouter } from 'react-router-dom'
import { describe, it, expect } from 'vitest'
import Login from './Login'

function renderizarEn(ruta) {
  return render(
    <MemoryRouter initialEntries={[ruta]}>
      <Login />
    </MemoryRouter>,
  )
}

describe('Login', () => {
  it('muestra el aviso cuando llega desde una sesión vencida', () => {
    // Arrange + Act
    renderizarEn('/login?expirada=1')

    // Assert
    expect(screen.getByRole('alert')).toHaveTextContent('Tu sesión expiró')
  })

  it('sin el parámetro no muestra ningún aviso', () => {
    // Arrange + Act
    renderizarEn('/login')

    // Assert
    expect(screen.queryByRole('alert')).not.toBeInTheDocument()
  })
})
