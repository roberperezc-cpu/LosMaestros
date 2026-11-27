import ResumenTotales from '../molecules/ResumenTotales'
import Notificacion from '../molecules/Notificacion'
import BotonEnlace from '../atoms/BotonEnlace'
import FormularioCheckout from './FormularioCheckout'

// La compra se registra en la base de datos a nombre de un cliente, así que hace falta
// haber iniciado sesión con la API (sesión con token).
function ResumenCompra({ neto, iva, total, puedeComprar, onConfirmar }) {
  return (
    <section className="card">
      <h2>Resumen de Compra</h2>
      <ResumenTotales neto={neto} iva={iva} total={total} />

      {puedeComprar ? (
        <FormularioCheckout onConfirmar={onConfirmar} />
      ) : (
        <>
          <Notificacion tipo="danger">
            Para confirmar tu compra debes iniciar sesión con tu cuenta de cliente.
          </Notificacion>
          <div className="barra-acciones">
            <BotonEnlace to="/login" variante="primario">Iniciar sesión</BotonEnlace>
            <BotonEnlace to="/registro" variante="secundario">Crear cuenta</BotonEnlace>
          </div>
        </>
      )}
    </section>
  )
}

export default ResumenCompra
