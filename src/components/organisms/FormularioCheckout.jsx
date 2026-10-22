import { useState } from 'react'
import Form from 'react-bootstrap/Form'
import Button from 'react-bootstrap/Button'
import CampoValidado from '../molecules/CampoValidado'
import CamposRegionComuna from '../molecules/CamposRegionComuna'
import tiposEntrega from '../../data/tiposEntrega'
import metodosPago from '../../data/metodosPago'
import { validarCheckout } from '../../utils/validaciones'
import { obtenerSesion } from '../../utils/sesion'

function FormularioCheckout({ onConfirmar }) {
  // Si hay sesión iniciada, se precargan los datos del usuario.
  const sesion = obtenerSesion()

  // Las sesiones guardadas antes del registro pueden no tener todos los campos.
  const dato = (campo) => (sesion && sesion[campo]) || ''

  const [formulario, setFormulario] = useState({
    nombre: dato('nombre'),
    rut: dato('rut'),
    telefono: dato('telefono'),
    tipoEntrega: '',
    region: dato('region'),
    comuna: dato('comuna'),
    direccion: '',
    metodoPago: '',
  })
  const [errores, setErrores] = useState({})

  const manejarCambio = (event) => {
    const { name, value } = event.target

    setFormulario((prev) => {
      const siguiente = { ...prev, [name]: value }
      if (name === 'region') siguiente.comuna = ''
      return siguiente
    })
  }

  const manejarSubmit = (event) => {
    event.preventDefault()

    const nuevosErrores = validarCheckout(formulario)
    setErrores(nuevosErrores)
    if (Object.keys(nuevosErrores).length > 0) return

    onConfirmar(formulario)
  }

  return (
    <Form noValidate onSubmit={manejarSubmit}>
      <h3>Datos de entrega y pago</h3>

      <CampoValidado
        id="nombre"
        label="Nombre completo:"
        name="nombre"
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
        id="telefono"
        label="Teléfono celular:"
        name="telefono"
        placeholder="+56 9 1234 5678"
        value={formulario.telefono}
        onChange={manejarCambio}
        error={errores.telefono}
      />

      <CampoValidado
        id="tipoEntrega"
        label="Tipo de entrega:"
        as="select"
        name="tipoEntrega"
        value={formulario.tipoEntrega}
        onChange={manejarCambio}
        error={errores.tipoEntrega}
      >
        <option value="">Selecciona una opción</option>
        {tiposEntrega.map((tipo) => (
          <option key={tipo.value} value={tipo.value}>{tipo.label}</option>
        ))}
      </CampoValidado>

      {formulario.tipoEntrega === 'despacho' && (
        <>
          <CamposRegionComuna
            region={formulario.region}
            comuna={formulario.comuna}
            errorRegion={errores.region}
            errorComuna={errores.comuna}
            onChange={manejarCambio}
          />

          <CampoValidado
            id="direccion"
            label="Dirección:"
            name="direccion"
            placeholder="Av. del Mar 1234"
            value={formulario.direccion}
            onChange={manejarCambio}
            error={errores.direccion}
          />
        </>
      )}

      <CampoValidado
        id="metodoPago"
        label="Método de pago:"
        as="select"
        name="metodoPago"
        value={formulario.metodoPago}
        onChange={manejarCambio}
        error={errores.metodoPago}
      >
        <option value="">Selecciona una opción</option>
        {metodosPago.map((metodo) => (
          <option key={metodo.value} value={metodo.value}>{metodo.label}</option>
        ))}
      </CampoValidado>

      <Button type="submit" variant="primary" className="btn-block">
        Confirmar Compra
      </Button>
    </Form>
  )
}

export default FormularioCheckout
