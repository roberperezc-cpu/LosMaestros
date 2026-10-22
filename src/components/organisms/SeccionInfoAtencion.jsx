import BloqueInfo from '../molecules/BloqueInfo'

function SeccionInfoAtencion({ bloques }) {
  return (
    <section className="card info-section">
      <h2>Información de Atención</h2>
      <div className="info-grid">
        {bloques.map((bloque) => (
          <BloqueInfo key={bloque.titulo} titulo={bloque.titulo} lineas={bloque.lineas} />
        ))}
      </div>
    </section>
  )
}

export default SeccionInfoAtencion
