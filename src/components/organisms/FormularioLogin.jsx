import { useState } from 'react'
import CampoFormulario from '../molecules/CampoFormulario'
import Entrada from '../atoms/Entrada'
import Boton from '../atoms/Boton'

function FormularioLogin() {
  const [formulario, setFormulario] = useState({ rut: '', password: '' })

  const manejarCambio = (event) => {
    const { name, value } = event.target
    setFormulario((prev) => ({ ...prev, [name]: value }))
  }

  const manejarSubmit = (event) => {
    event.preventDefault()
    // Pendiente (paso 2): validar credenciales estáticas y guardar sesión en localStorage.
  }

  return (
    <form onSubmit={manejarSubmit}>
      <CampoFormulario id="rut" label="RUT Contratista o Empresa:">
        <Entrada
          id="rut"
          name="rut"
          placeholder="12.345.678-K"
          value={formulario.rut}
          onChange={manejarCambio}
          required
        />
      </CampoFormulario>

      <CampoFormulario id="password" label="Contraseña:">
        <Entrada
          id="password"
          type="password"
          name="password"
          placeholder="••••••••"
          value={formulario.password}
          onChange={manejarCambio}
          required
        />
      </CampoFormulario>

      <Boton type="submit" bloque>Ingresar al Portal</Boton>
    </form>
  )
}

export default FormularioLogin
