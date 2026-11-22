import { useState } from 'react'
import { useLocation } from 'react-router-dom'
import Layout from '../components/organisms/Layout'
import PanelAlertas from '../components/organisms/PanelAlertas'
import TablaInventario from '../components/organisms/TablaInventario'
import TablaContratistas from '../components/organisms/TablaContratistas'
import Notificacion from '../components/molecules/Notificacion'
import BotonEnlace from '../components/atoms/BotonEnlace'
import contratistas from '../data/contratistas'
import { mensajeDeError } from '../utils/errores'

function Admin({ productos, onEliminarProducto }) {
  const ubicacion = useLocation()

  // El formulario de producto avisa aquí que guardó correctamente (state de la navegación).
  const [mensaje, setMensaje] = useState((ubicacion.state && ubicacion.state.mensaje) || '')
  const [error, setError] = useState('')

  const eliminar = async (producto) => {
    if (!window.confirm(`¿Eliminar "${producto.nombre}" del inventario?`)) return

    setMensaje('')
    setError('')
    try {
      await onEliminarProducto(producto.id)
      setMensaje(`Producto "${producto.nombre}" eliminado.`)
    } catch (e) {
      setError(mensajeDeError(e))
    }
  }

  return (
    <Layout subtitulo="Panel de Control (Dueño)" textoPie="Panel Administrativo.">
      <main className="container">
        <h2>Gestión de Inventario y Cuentas Corrientes</h2>

        {mensaje && <Notificacion tipo="success">{mensaje}</Notificacion>}
        {error && <Notificacion tipo="danger">{error}</Notificacion>}

        <PanelAlertas productos={productos} />

        <div className="barra-acciones">
          <BotonEnlace to="/admin/productos/nuevo" variante="primario">+ Agregar producto</BotonEnlace>
        </div>

        <TablaInventario productos={productos} onEliminar={eliminar} />
        <TablaContratistas contratistas={contratistas} />
      </main>
    </Layout>
  )
}

export default Admin
