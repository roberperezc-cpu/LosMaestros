import CampoValidado from './CampoValidado'
import regiones from '../../data/regiones'

// Par de selectores dependientes: la comuna se habilita al elegir región.
// Devuelve un fragmento para que los campos queden dentro de la grilla del formulario.
function CamposRegionComuna({ region, comuna, errorRegion, errorComuna, onChange }) {
  const regionSeleccionada = regiones.find((r) => r.value === region)
  const comunas = regionSeleccionada ? regionSeleccionada.comunas : []

  return (
    <>
      <CampoValidado
        id="region"
        label="Región:"
        as="select"
        name="region"
        value={region}
        onChange={onChange}
        error={errorRegion}
      >
        <option value="">Selecciona una región</option>
        {regiones.map((r) => (
          <option key={r.value} value={r.value}>{r.label}</option>
        ))}
      </CampoValidado>

      <CampoValidado
        id="comuna"
        label="Comuna:"
        as="select"
        name="comuna"
        value={comuna}
        onChange={onChange}
        error={errorComuna}
        disabled={!region}
      >
        <option value="">Selecciona una comuna</option>
        {comunas.map((c) => (
          <option key={c} value={c}>{c}</option>
        ))}
      </CampoValidado>
    </>
  )
}

export default CamposRegionComuna
