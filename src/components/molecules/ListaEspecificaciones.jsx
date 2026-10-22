function ListaEspecificaciones({ especificaciones }) {
  const entradas = Object.entries(especificaciones)

  // Los productos creados desde el panel pueden no tener especificaciones.
  if (entradas.length === 0) return null

  return (
    <div className="specs-section">
      <h3>Especificaciones Técnicas</h3>
      <ul>
        {entradas.map(([clave, valor]) => (
          <li key={clave}><strong>{clave}:</strong> {valor}</li>
        ))}
      </ul>
    </div>
  )
}

export default ListaEspecificaciones
