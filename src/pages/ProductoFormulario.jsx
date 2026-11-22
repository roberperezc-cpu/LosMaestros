import { useEffect, useState } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import Layout from '../components/organisms/Layout'
import FormularioProducto from '../components/organisms/FormularioProducto'
import Notificacion from '../components/molecules/Notificacion'
import BotonEnlace from '../components/atoms/BotonEnlace'
import ProductoService from '../services/ProductoService'
import { mensajeDeError } from '../utils/errores'

/**
 * Sin :id en la ruta crea un producto (/admin/productos/nuevo);
 * con :id lo carga desde la API y lo edita (/admin/productos/:id/editar).
 */
function ProductoFormulario({ productos, onCrear, onActualizar }) {
  const { id } = useParams()
  const navigate = useNavigate()

  const [producto, setProducto] = useState(null)
  const [cargando, setCargando] = useState(Boolean(id))
  const [errorCarga, setErrorCarga] = useState('')

  // Al editar: busca el producto por ID en la API (GET /api/productos/{id}).
  useEffect(() => {
    if (!id) return

    ProductoService.buscarPorId(id)
      .then(setProducto)
      .catch((error) => setErrorCarga(mensajeDeError(error)))
      .finally(() => setCargando(false))
  }, [id])

  const guardar = async (datos) => {
    if (id) {
      await onActualizar(id, datos)
    } else {
      await onCrear(datos)
    }
    navigate('/admin', {
      state: { mensaje: id ? 'Producto actualizado correctamente.' : 'Producto creado correctamente.' },
    })
  }

  let contenido
  if (cargando) {
    contenido = <p>Cargando producto...</p>
  } else if (errorCarga) {
    contenido = (
      <section className="card">
        <Notificacion tipo="danger">{errorCarga}</Notificacion>
        <BotonEnlace to="/admin" variante="volver">&larr; Volver al panel</BotonEnlace>
      </section>
    )
  } else {
    contenido = (
      <FormularioProducto productos={productos} productoInicial={producto} onGuardar={guardar} />
    )
  }

  return (
    <Layout subtitulo="Panel de Control (Dueño)" textoPie="Panel Administrativo.">
      <main className="container">{contenido}</main>
    </Layout>
  )
}

export default ProductoFormulario
