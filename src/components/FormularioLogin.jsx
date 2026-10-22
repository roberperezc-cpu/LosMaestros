import { useState } from 'react'

function FormularioLogin() {
  const [formulario, setFormulario] = useState({ rut: '', password: '' })

  const manejarCambio = (event) => {
    const { name, value } = event.target
    setFormulario((prev) => ({ ...prev, [name]: value }))
  }

  const manejarSubmit = (event) => {
    event.preventDefault()
    // Pendiente: autenticación real cuando exista backend.
  }

  return (
    <form onSubmit={manejarSubmit}>
      <div className="form-group">
        <label htmlFor="rut">RUT Contratista o Empresa:</label>
        <input
          type="text"
          id="rut"
          name="rut"
          placeholder="12.345.678-K"
          value={formulario.rut}
          onChange={manejarCambio}
          required
        />
      </div>

      <div className="form-group">
        <label htmlFor="password">Contraseña:</label>
        <input
          type="password"
          id="password"
          name="password"
          placeholder="••••••••"
          value={formulario.password}
          onChange={manejarCambio}
          required
        />
      </div>

      <button type="submit" className="btn btn-primary btn-block">Ingresar al Portal</button>
    </form>
  )
}

export default FormularioLogin
