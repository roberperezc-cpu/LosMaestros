import { useState } from 'react'
import Form from 'react-bootstrap/Form'
import Button from 'react-bootstrap/Button'
import CampoValidado from '../molecules/CampoValidado'
import Notificacion from '../molecules/Notificacion'
import BotonEnlace from '../atoms/BotonEnlace'
import categorias from '../../data/categorias'
import { validarProducto } from '../../utils/validaciones'
import { crearProducto } from '../../utils/productos'
import { mensajeDeError } from '../../utils/errores'

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

// Al editar, el formulario parte con los datos del producto (todo como texto).
function formularioDesde(producto) {
  if (!producto) return FORMULARIO_VACIO

  return {
    sku: producto.id,
    nombre: producto.nombre,
    categoria: producto.categoria,
    precio: String(producto.precio),
    stock: String(producto.stock),
    stockMinimo: String(producto.stockMinimo),
    ubicacion: producto.ubicacion,
    marca: (producto.especificaciones && producto.especificaciones.Marca) || '',
  }
}

/**
 * Formulario de producto. Sirve para crear (productoInicial = null) y para editar.
 * onGuardar(producto) debe devolver una promesa: si falla, se muestra el error del servidor.
 */
function FormularioProducto({ productos = [], productoInicial = null, onGuardar }) {
  const editando = Boolean(productoInicial)

  const [formulario, setFormulario] = useState(formularioDesde(productoInicial))
  const [errores, setErrores] = useState({})
  const [errorServidor, setErrorServidor] = useState('')
  const [guardando, setGuardando] = useState(false)

  const manejarCambio = (event) => {
    const { name, value } = event.target
    setFormulario((prev) => ({ ...prev, [name]: value }))
  }

  const manejarSubmit = async (event) => {
    event.preventDefault()
    setErrorServidor('')

    // Al editar, el SKU ya existe (es el del propio producto), así que no se busca repetido.
    const nuevosErrores = validarProducto(formulario, editando ? [] : productos)
    setErrores(nuevosErrores)
    if (Object.keys(nuevosErrores).length > 0) return

    setGuardando(true)
    try {
      await onGuardar(crearProducto(formulario, productoInicial))
    } catch (error) {
      setErrorServidor(mensajeDeError(error))
      setGuardando(false)
    }
  }

  return (
    <section className="card">
      <h3>{editando ? 'Editar Producto' : 'Registrar Nuevo Producto'}</h3>
      <p>
        {editando
          ? 'Modifica los datos del producto. El SKU no se puede cambiar.'
          : 'El producto se guarda en la base de datos y se le asigna una imagen genérica.'}
      </p>

      <Form noValidate onSubmit={manejarSubmit}>
        {errorServidor && <Notificacion tipo="danger">{errorServidor}</Notificacion>}

        <div className="form-grid">
          <CampoValidado
            id="sku"
            label="Código SKU:"
            name="sku"
            placeholder="HER-MAR-010"
            value={formulario.sku}
            onChange={manejarCambio}
            error={errores.sku}
            readOnly={editando}
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
            label={editando ? 'Stock:' : 'Stock inicial:'}
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

        <div className="barra-acciones">
          <Button type="submit" variant="primary" disabled={guardando}>
            {guardando ? 'Guardando...' : editando ? 'Guardar cambios' : 'Agregar Producto'}
          </Button>
          <BotonEnlace to="/admin" variante="secundario">Cancelar</BotonEnlace>
        </div>
      </Form>
    </section>
  )
}

export default FormularioProducto
