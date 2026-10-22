import BotonEnlace from '../atoms/BotonEnlace'

function TarjetaServicio({ servicio }) {
  return (
    <article className="card service-card">
      <h3>{servicio.titulo}</h3>
      <p>{servicio.texto}</p>
      <BotonEnlace to={servicio.to} variante="servicio">
        {servicio.enlace} &rarr;
      </BotonEnlace>
    </article>
  )
}

export default TarjetaServicio
