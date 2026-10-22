import { fireEvent, render, screen } from '@testing-library/react'
import { MemoryRouter } from 'react-router-dom'
import { describe, it, expect } from 'vitest'
import Catalogo from './Catalogo'
import productos from '../data/productos'

function renderCatalogo() {
  return render(
    <MemoryRouter>
      <Catalogo productos={productos} />
    </MemoryRouter>,
  )
}

describe('Catalogo', () => {
  it('muestra todos los productos al inicio', () => {
    // Arrange + Act
    renderCatalogo()

    // Assert
    expect(screen.getAllByRole('article')).toHaveLength(4)
  })

  it('filtra en vivo al escribir en el buscador', () => {
    // Arrange
    renderCatalogo()

    // Act
    fireEvent.change(screen.getByPlaceholderText(/Buscar por código/i), {
      target: { value: 'taladro' },
    })

    // Assert
    expect(screen.getAllByRole('article')).toHaveLength(1)
    expect(screen.getByRole('heading', { level: 4 })).toHaveTextContent('Taladro Percutor')
  })

  it('muestra un mensaje cuando no hay coincidencias', () => {
    // Arrange
    renderCatalogo()

    // Act
    fireEvent.change(screen.getByPlaceholderText(/Buscar por código/i), {
      target: { value: 'zzzz' },
    })

    // Assert
    expect(screen.getByText(/No se encontraron productos/i)).toBeInTheDocument()
  })
})
