function ListaEspecificaciones({ especificaciones }) {
  return (
    <div className="specs-section">
      <h3>Especificaciones Técnicas</h3>
      <ul>
        {Object.entries(especificaciones).map(([clave, valor]) => (
          <li key={clave}><strong>{clave}:</strong> {valor}</li>
        ))}
      </ul>
    </div>
  )
}

export default ListaEspecificaciones
