import { fireEvent, render, screen } from '@testing-library/react'
import { MemoryRouter } from 'react-router-dom'
import { describe, it, expect } from 'vitest'
import Catalogo from './Catalogo'

function renderCatalogo() {
  return render(
    <MemoryRouter>
      <Catalogo />
    </MemoryRouter>,
  )
}

describe('Catalogo', () => {
  it('muestra todos los productos al inicio', () => {
    renderCatalogo()
    expect(screen.getAllByRole('article')).toHaveLength(4)
  })

  it('filtra en vivo al escribir en el buscador', () => {
    renderCatalogo()

    fireEvent.change(screen.getByPlaceholderText(/Buscar por código/i), {
      target: { value: 'taladro' },
    })

    expect(screen.getAllByRole('article')).toHaveLength(1)
    expect(screen.getByRole('heading', { level: 4 })).toHaveTextContent('Taladro Percutor')
  })

  it('muestra un mensaje cuando no hay coincidencias', () => {
    renderCatalogo()

    fireEvent.change(screen.getByPlaceholderText(/Buscar por código/i), {
      target: { value: 'zzzz' },
    })

    expect(screen.getByText(/No se encontraron productos/i)).toBeInTheDocument()
  })
})
