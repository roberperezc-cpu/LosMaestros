import { fireEvent, render, screen } from '@testing-library/react'
import { MemoryRouter } from 'react-router-dom'
import { describe, it, expect, beforeEach } from 'vitest'
import App from './App'
import { guardarSesion } from './utils/sesion'

function escribir(etiqueta, valor) {
  fireEvent.change(screen.getByLabelText(etiqueta), { target: { value: valor } })
}

describe('App', () => {
  beforeEach(() => {
    localStorage.clear()
  })

  it('un producto creado en el panel admin aparece en el catálogo', () => {
    // Arrange
    guardarSesion({ nombre: 'Administrador', rol: 'admin' })
    render(
      <MemoryRouter initialEntries={['/admin']}>
        <App />
      </MemoryRouter>,
    )

    // Act
    escribir('Código SKU:', 'HER-MAR-010')
    escribir('Nombre del producto:', 'Martillo Carpintero 16oz')
    escribir('Categoría:', 'herramientas-man')
    escribir('Precio (CLP):', '9990')
    escribir('Stock inicial:', '25')
    escribir('Stock mínimo:', '5')
    escribir('Ubicación en bodega:', 'Pasillo C - Estante 1')
    fireEvent.click(screen.getByRole('button', { name: 'Agregar Producto' }))
    fireEvent.click(screen.getByRole('link', { name: 'Catálogo y Stock' }))

    // Assert
    expect(screen.getByText('Martillo Carpintero 16oz')).toBeInTheDocument()
    expect(screen.getAllByRole('article')).toHaveLength(5)
  })

  it('sin sesión, /admin redirige al login', () => {
    // Arrange + Act
    render(
      <MemoryRouter initialEntries={['/admin']}>
        <App />
      </MemoryRouter>,
    )

    // Assert
    expect(screen.getByRole('heading', { name: 'Portal Contratistas' })).toBeInTheDocument()
  })
})
