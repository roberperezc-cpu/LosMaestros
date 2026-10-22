import categorias from '../data/categorias'

function FiltroCatalogo({ texto, categoria, onTextoChange, onCategoriaChange }) {
  return (
    <section className="search-section card">
      <h2>Consulta Rápida de Disponibilidad</h2>
      <p>Verifica el stock disponible en bodega antes de realizar tu pedido.</p>

      {/* El filtrado es en vivo; el submit solo evita recargar la página */}
      <form className="search-form" id="search-form" onSubmit={(e) => e.preventDefault()}>
        <div className="form-group">
          <input
            type="text"
            id="search-input"
            placeholder="Buscar por código, nombre o categoría (ej: Cemento, Taladro)..."
            value={texto}
            onChange={(e) => onTextoChange(e.target.value)}
          />
        </div>
        <div className="form-group">
          <select
            id="category-filter"
            value={categoria}
            onChange={(e) => onCategoriaChange(e.target.value)}
          >
            <option value="">Todas las categorías</option>
            {categorias.map((cat) => (
              <option key={cat.value} value={cat.value}>{cat.label}</option>
            ))}
          </select>
        </div>
        <button type="submit" className="btn btn-primary">Buscar Stock</button>
      </form>
    </section>
  )
}

export default FiltroCatalogo
