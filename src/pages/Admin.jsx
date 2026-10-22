import Layout from '../components/Layout'
import productos from '../data/productos'
import contratistas from '../data/contratistas'
import { productosParaReponer } from '../utils/stock'
import { formatearPrecio } from '../utils/formato'

function Admin() {
  // Antes las alertas estaban escritas a mano; ahora salen del inventario.
  const alertas = productosParaReponer(productos)

  return (
    <Layout subtitulo="Panel de Control (Dueño)" textoPie="Panel Administrativo.">
      <main className="container">
        <h2>Gestión de Inventario y Cuentas Corrientes</h2>

        <section className="card alert-card">
          <h3>⚠️ Alertas de Reposición de Stock</h3>
          <p>Los siguientes productos están por debajo del punto mínimo de reposición:</p>
          <ul className="alert-list">
            {alertas.map((p) => (
              <li key={p.id}>
                <strong>{p.nombre} (SKU: {p.id})</strong>: Quedan {p.stock} unidades
                {p.stock === 0 ? ' (Agotado).' : ` (Mínimo recomendado: ${p.stockMinimo}).`}
              </li>
            ))}
          </ul>
        </section>

        <section className="card">
          <h3>Estado de Cuentas Corrientes (Contratistas)</h3>
          <table className="table">
            <thead>
              <tr>
                <th>Contratista / Empresa</th>
                <th>RUT</th>
                <th>Compras Mes</th>
                <th>Deuda Pendiente</th>
                <th>Acción</th>
              </tr>
            </thead>
            <tbody>
              {contratistas.map((c) => (
                <tr key={c.rut}>
                  <td>{c.nombre}</td>
                  <td>{c.rut}</td>
                  <td>{c.comprasMes} compras</td>
                  <td>{formatearPrecio(c.deuda)} CLP</td>
                  <td><button type="button" className="btn-sm">Ver Historial</button></td>
                </tr>
              ))}
            </tbody>
          </table>
        </section>
      </main>
    </Layout>
  )
}

export default Admin
