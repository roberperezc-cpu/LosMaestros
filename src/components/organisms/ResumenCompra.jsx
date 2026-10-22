import ResumenTotales from '../molecules/ResumenTotales'
import FormularioCheckout from './FormularioCheckout'

function ResumenCompra({ neto, iva, total, onConfirmar }) {
  return (
    <section className="card">
      <h2>Resumen de Compra</h2>
      <ResumenTotales neto={neto} iva={iva} total={total} />
      <FormularioCheckout onConfirmar={onConfirmar} />
    </section>
  )
}

export default ResumenCompra
