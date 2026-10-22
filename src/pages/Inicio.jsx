import { Link } from 'react-router-dom'
import Layout from '../components/Layout'

const servicios = [
  {
    titulo: 'Consulta de Stock en Tiempo Real',
    texto:
      'Revisa la disponibilidad exacta de más de 800 referencias desde tu celular antes de dirigirte a la tienda o enviar a tu equipo a bodega.',
    to: '/catalogo',
    enlace: 'Ir al catálogo',
  },
  {
    titulo: 'Cuentas Corrientes Digitales',
    texto:
      'Si eres contratista o maestro de obra, accede a tu portal privado para revisar facturas pendientes, historial de compras y cupo disponible.',
    to: '/login',
    enlace: 'Ingresar a mi cuenta',
  },
  {
    titulo: 'Atención Rápida en Mesón',
    texto:
      'Facturación e inventario sincronizados al instante para que tus compras en local sean atendidas en el menor tiempo posible.',
    to: '/pos',
    enlace: 'Acceso vendedores',
  },
]

function Inicio() {
  return (
    <Layout>
      <main className="container">
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
              <Link to="/catalogo" className="btn btn-primary">Consultar Catálogo y Stock</Link>
              <Link to="/login" className="btn btn-secondary">Portal Contratistas</Link>
            </div>
          </div>
        </section>

        <section className="services-grid">
          {servicios.map((servicio) => (
            <article className="card service-card" key={servicio.to}>
              <h3>{servicio.titulo}</h3>
              <p>{servicio.texto}</p>
              <Link to={servicio.to} className="service-link">{servicio.enlace} &rarr;</Link>
            </article>
          ))}
        </section>

        <section className="card info-section">
          <h2>Información de Atención</h2>
          <div className="info-grid">
            <div>
              <h4>Ubicación</h4>
              <p>Av. Principal #1234, La Serena, Región de Coquimbo.</p>
            </div>
            <div>
              <h4>Horarios de Tienda</h4>
              <p>Lunes a Viernes: 08:30 - 18:30 hrs</p>
              <p>Sábados: 09:00 - 14:00 hrs</p>
            </div>
            <div>
              <h4>Contacto Directo</h4>
              <p>Email: contacto@losmaestroslaserena.cl</p>
              <p>Soporte Cuentas Corrientes activo en sitio web.</p>
            </div>
          </div>
        </section>
      </main>
    </Layout>
  )
}

export default Inicio
