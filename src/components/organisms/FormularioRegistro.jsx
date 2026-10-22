import { useState } from 'react'
import Form from 'react-bootstrap/Form'
import Button from 'react-bootstrap/Button'
import CampoValidado from '../molecules/CampoValidado'
import CamposRegionComuna from '../molecules/CamposRegionComuna'
import tiposCliente from '../../data/tiposCliente'
import { validarRegistro } from '../../utils/validaciones'
import { obtenerTodosLosUsuarios, registrarUsuario } from '../../utils/usuarios'
import { guardarSesion } from '../../utils/sesion'

const FORMULARIO_VACIO = {
  nombre: '',
  rut: '',
  correo: '',
  telefono: '',
  tipoCliente: '',
  region: '',
  comuna: '',
  password: '',
  confirmarPassword: '',
  terminos: false,
}

function FormularioRegistro({ onRegistroExitoso }) {
  const [formulario, setFormulario] = useState(FORMULARIO_VACIO)
  const [errores, setErrores] = useState({})

  const manejarCambio = (event) => {
    const { name, value, type, checked } = event.target
    const nuevoValor = type === 'checkbox' ? checked : value

    setFormulario((prev) => {
      const siguiente = { ...prev, [name]: nuevoValor }
      // Al cambiar de región, la comuna elegida deja de ser válida.
      if (name === 'region') siguiente.comuna = ''
      return siguiente
    })
  }

  const manejarSubmit = (event) => {
    event.preventDefault()

    const nuevosErrores = validarRegistro(formulario, obtenerTodosLosUsuarios())
    setErrores(nuevosErrores)
    if (Object.keys(nuevosErrores).length > 0) return

    const usuario = registrarUsuario(formulario)
    guardarSesion(usuario)
    onRegistroExitoso(usuario)
  }

  return (
    <Form noValidate onSubmit={manejarSubmit}>
      <div className="form-grid">
        <CampoValidado
          id="nombre"
          label="Nombre completo o razón social:"
          name="nombre"
          placeholder="Juan Pérez"
          value={formulario.nombre}
          onChange={manejarCambio}
          error={errores.nombre}
        />

        <CampoValidado
          id="rut"
          label="RUT:"
          name="rut"
          placeholder="12.345.678-5"
          value={formulario.rut}
          onChange={manejarCambio}
          error={errores.rut}
        />

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
          id="telefono"
          label="Teléfono celular:"
          name="telefono"
          placeholder="+56 9 1234 5678"
          value={formulario.telefono}
          onChange={manejarCambio}
          error={errores.telefono}
        />

        <CampoValidado
          id="tipoCliente"
          label="Tipo de cliente:"
          as="select"
          name="tipoCliente"
          value={formulario.tipoCliente}
          onChange={manejarCambio}
          error={errores.tipoCliente}
        >
          <option value="">Selecciona una opción</option>
          {tiposCliente.map((tipo) => (
            <option key={tipo.value} value={tipo.value}>{tipo.label}</option>
          ))}
        </CampoValidado>

        <CamposRegionComuna
          region={formulario.region}
          comuna={formulario.comuna}
          errorRegion={errores.region}
          errorComuna={errores.comuna}
          onChange={manejarCambio}
        />

        <CampoValidado
          id="password"
          label="Contraseña:"
          type="password"
          name="password"
          placeholder="Mínimo 6 caracteres, con letras y números"
          value={formulario.password}
          onChange={manejarCambio}
          error={errores.password}
        />

        <CampoValidado
          id="confirmarPassword"
          label="Confirmar contraseña:"
          type="password"
          name="confirmarPassword"
          placeholder="Repite la contraseña"
          value={formulario.confirmarPassword}
          onChange={manejarCambio}
          error={errores.confirmarPassword}
        />
      </div>

      <Form.Group className="form-group" controlId="terminos">
        <Form.Check
          type="checkbox"
          name="terminos"
          label="Acepto los términos y condiciones"
          checked={formulario.terminos}
          onChange={manejarCambio}
          isInvalid={Boolean(errores.terminos)}
          feedback={errores.terminos}
          feedbackType="invalid"
        />
      </Form.Group>

      <Button type="submit" variant="primary">
        Crear Cuenta
      </Button>
    </Form>
  )
}

export default FormularioRegistro
