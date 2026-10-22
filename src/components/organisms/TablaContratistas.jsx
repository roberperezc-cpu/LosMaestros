import FilaContratista from '../molecules/FilaContratista'

function TablaContratistas({ contratistas }) {
  return (
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
            <FilaContratista key={c.rut} contratista={c} />
          ))}
        </tbody>
      </table>
    </section>
  )
}

export default TablaContratistas
