import TarjetaServicio from '../molecules/TarjetaServicio'

function GrillaServicios({ servicios }) {
  return (
    <section className="services-grid">
      {servicios.map((servicio) => (
        <TarjetaServicio key={servicio.to} servicio={servicio} />
      ))}
    </section>
  )
}

export default GrillaServicios
