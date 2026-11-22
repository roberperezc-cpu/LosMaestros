import { useState } from 'react'
import Form from 'react-bootstrap/Form'
import Button from 'react-bootstrap/Button'
import Alert from 'react-bootstrap/Alert'
import CampoValidado from '../molecules/CampoValidado'
import { validarLogin } from '../../utils/validaciones'
import { iniciarSesion } from '../../services/SesionService'

function FormularioLogin({ onLoginExitoso }) {
  const [formulario, setFormulario] = useState({ correo: '', password: '' })
  const [errores, setErrores] = useState({})
  const [errorGeneral, setErrorGeneral] = useState('')
  const [enviando, setEnviando] = useState(false)

  const manejarCambio = (event) => {
    const { name, value } = event.target
    setFormulario((prev) => ({ ...prev, [name]: value }))
  }

  const manejarSubmit = async (event) => {
    event.preventDefault()
    setErrorGeneral('')

    const nuevosErrores = validarLogin(formulario)
    setErrores(nuevosErrores)
    if (Object.keys(nuevosErrores).length > 0) return

    setEnviando(true)
    const usuario = await iniciarSesion(formulario.correo, formulario.password)
    setEnviando(false)

    if (!usuario) {
      setErrorGeneral('Correo o contraseña incorrectos.')
      return
    }

    onLoginExitoso(usuario)
  }

  return (
    <Form noValidate onSubmit={manejarSubmit}>
      {errorGeneral && (
        <Alert variant="danger" transition={false}>
          {errorGeneral}
        </Alert>
      )}

      <CampoValidado
        id="correo"
        label="Correo electrónico:"
        type="email"
        name="correo"
        placeholder="correo@ejemplo.cl"
        value={formulario.correo}
        onChange={manejarCambio}
        error={errores.correo}
      />

      <CampoValidado
        id="password"
        label="Contraseña:"
        type="password"
        name="password"
        placeholder="••••••••"
        value={formulario.password}
        onChange={manejarCambio}
        error={errores.password}
      />

      <Button type="submit" variant="primary" className="btn-block" disabled={enviando}>
        Ingresar al Portal
      </Button>
    </Form>
  )
}

export default FormularioLogin
