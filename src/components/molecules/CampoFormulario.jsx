// Etiqueta + control (Entrada / Selector) dentro de un .form-group
function CampoFormulario({ id, label, children }) {
  return (
    <div className="form-group">
      {label && <label htmlFor={id}>{label}</label>}
      {children}
    </div>
  )
}

export default CampoFormulario
