import BotonEnlace from '../atoms/BotonEnlace'

function Hero() {
  return (
    <section className="card hero-banner">
      <div className="hero-content">
        <h2>22 años respaldando a los maestros y familias de La Serena</h2>
        <p>
          En <strong>Ferretería Los Maestros</strong> simplificamos tus compras de materiales de
          construcción, herramientas y artículos de ferretería general. Ahora con nuestra nueva
          plataforma digital, puedes consultar stock en tiempo real y gestionar tu cuenta
          corriente sin esperas telefónicas.
        </p>
        <div className="hero-buttons">
          <BotonEnlace to="/catalogo" variante="primario">Consultar Catálogo y Stock</BotonEnlace>
          <BotonEnlace to="/login" variante="secundario">Portal Contratistas</BotonEnlace>
        </div>
      </div>
    </section>
  )
}

export default Hero
