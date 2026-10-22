// Filtro del catálogo. Busca por nombre, SKU o categoría
// (el placeholder del buscador ya prometía buscar por categoría).
export function filtrarProductos(productos, texto = '', categoria = '') {
  const busqueda = texto.toLowerCase().trim()

  return productos.filter((p) => {
    const coincideTexto =
      busqueda === '' ||
      p.nombre.toLowerCase().includes(busqueda) ||
      p.id.toLowerCase().includes(busqueda) ||
      p.categoriaNombre.toLowerCase().includes(busqueda)
    const coincideCategoria = categoria === '' || p.categoria === categoria
    return coincideTexto && coincideCategoria
  })
}
