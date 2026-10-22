import DatoPerfil from '../molecules/DatoPerfil'
import regiones from '../../data/regiones'
import tiposCliente from '../../data/tiposCliente'

const ETIQUETAS_ROL = {
  admin: 'Administrador',
  contratista: 'Contratista',
  cliente: 'Cliente',
}

function DatosPerfil({ usuario }) {
  const region = regiones.find((r) => r.value === usuario.region)
  const tipo = tiposCliente.find((t) => t.value === usuario.tipoCliente)

  return (
    <section className="card">
      <h2>Mi Perfil</h2>
      <p>Estos son los datos asociados a tu cuenta.</p>

      <div className="specs-section">
        <h3>{usuario.nombre}</h3>
        <ul>
          <DatoPerfil etiqueta="Correo" valor={usuario.correo} />
          <DatoPerfil etiqueta="RUT" valor={usuario.rut} />
          <DatoPerfil etiqueta="Teléfono" valor={usuario.telefono} />
          <DatoPerfil etiqueta="Tipo de cliente" valor={tipo ? tipo.label : usuario.tipoCliente} />
          <DatoPerfil etiqueta="Región" valor={region ? region.label : usuario.region} />
          <DatoPerfil etiqueta="Comuna" valor={usuario.comuna} />
          <DatoPerfil etiqueta="Rol" valor={ETIQUETAS_ROL[usuario.rol] || usuario.rol} />
        </ul>
      </div>
    </section>
  )
}

export default DatosPerfil
