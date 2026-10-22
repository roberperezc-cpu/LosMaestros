import { useState } from 'react'
import Form from 'react-bootstrap/Form'
import Button from 'react-bootstrap/Button'
import Alert from 'react-bootstrap/Alert'
import CampoValidado from '../molecules/CampoValidado'
import categorias from '../../data/categorias'
import { validarProducto } from '../../utils/validaciones'
import { crearProducto } from '../../utils/productos'

const FORMULARIO_VACIO = {
  sku: '',
  nombre: '',
  categoria: '',
  precio: '',
  stock: '',
  stockMinimo: '',
  ubicacion: '',
  marca: '',
}

function FormularioProducto({ productos, onAgregarProducto }) {
  const [formulario, setFormulario] = useState(FORMULARIO_VACIO)
  const [errores, setErrores] = useState({})
  const [mensajeExito, setMensajeExito] = useState('')

  const manejarCambio = (event) => {
    const { name, value } = event.target
    setFormulario((prev) => ({ ...prev, [name]: value }))
    setMensajeExito('')
  }

  const manejarSubmit = (event) => {
    event.preventDefault()

    const nuevosErrores = validarProducto(formulario, productos)
    setErrores(nuevosErrores)
    if (Object.keys(nuevosErrores).length > 0) return

    const nuevoProducto = crearProducto(formulario)
    onAgregarProducto(nuevoProducto)

    setFormulario(FORMULARIO_VACIO)
    setMensajeExito(`Producto "${nuevoProducto.nombre}" agregado al catálogo.`)
  }

  return (
    <section className="card">
      <h3>Registrar Nuevo Producto</h3>
      <p>
        El producto se agrega al catálogo mientras la página esté abierta y se le asigna una imagen
        genérica.
      </p>

      <Form noValidate onSubmit={manejarSubmit}>
        {mensajeExito && (
          <Alert variant="success" transition={false}>
            {mensajeExito}
          </Alert>
        )}

        <div className="form-grid">
          <CampoValidado
            id="sku"
            label="Código SKU:"
            name="sku"
            placeholder="HER-MAR-010"
            value={formulario.sku}
            onChange={manejarCambio}
            error={errores.sku}
          />

          <CampoValidado
            id="nombre"
            label="Nombre del producto:"
            name="nombre"
            placeholder="Martillo Carpintero 16oz"
            value={formulario.nombre}
            onChange={manejarCambio}
            error={errores.nombre}
          />

          <CampoValidado
            id="categoria"
            label="Categoría:"
            as="select"
            name="categoria"
            value={formulario.categoria}
            onChange={manejarCambio}
            error={errores.categoria}
          >
            <option value="">Selecciona una categoría</option>
            {categorias.map((cat) => (
              <option key={cat.value} value={cat.value}>{cat.label}</option>
            ))}
          </CampoValidado>

          <CampoValidado
            id="marca"
            label="Marca (opcional):"
            name="marca"
            placeholder="Stanley"
            value={formulario.marca}
            onChange={manejarCambio}
          />

          <CampoValidado
            id="precio"
            label="Precio (CLP):"
            type="number"
            name="precio"
            placeholder="9990"
            value={formulario.precio}
            onChange={manejarCambio}
            error={errores.precio}
          />

          <CampoValidado
            id="stock"
            label="Stock inicial:"
            type="number"
            name="stock"
            placeholder="25"
            value={formulario.stock}
            onChange={manejarCambio}
            error={errores.stock}
          />

          <CampoValidado
            id="stockMinimo"
            label="Stock mínimo:"
            type="number"
            name="stockMinimo"
            placeholder="5"
            value={formulario.stockMinimo}
            onChange={manejarCambio}
            error={errores.stockMinimo}
          />

          <CampoValidado
            id="ubicacion"
            label="Ubicación en bodega:"
            name="ubicacion"
            placeholder="Pasillo C - Estante 1"
            value={formulario.ubicacion}
            onChange={manejarCambio}
            error={errores.ubicacion}
          />
        </div>

        <Button type="submit" variant="primary">
          Agregar Producto
        </Button>
      </Form>
    </section>
  )
}

export default FormularioProducto
