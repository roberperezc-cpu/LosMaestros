import { useState } from 'react'
import Layout from '../components/Layout'
import TablaProductosPOS from '../components/TablaProductosPOS'
import DetalleVenta from '../components/DetalleVenta'
import productos from '../data/productos'

function POS() {
  const [busqueda, setBusqueda] = useState('')
  const [carrito, setCarrito] = useState([])
  const [tipoCliente, setTipoCliente] = useState('particular')

  const texto = busqueda.toLowerCase().trim()
  const productosFiltrados = productos.filter(
    (p) => p.nombre.toLowerCase().includes(texto) || p.id.toLowerCase().includes(texto),
  )

  const agregarAlCarrito = (producto) => {
    if (producto.stock === 0) {
      alert('Producto sin stock disponible')
      return
    }

    const enCarrito = carrito.find((item) => item.id === producto.id)

    if (enCarrito && enCarrito.cantidad >= producto.stock) {
      alert('No hay suficiente stock disponible')
      return
    }

    setCarrito((prev) =>
      enCarrito
        ? prev.map((item) =>
            item.id === producto.id ? { ...item, cantidad: item.cantidad + 1 } : item,
          )
        : [...prev, { id: producto.id, nombre: producto.nombre, precio: producto.precio, cantidad: 1 }],
    )
  }

  return (
    <Layout
      subtitulo="Módulo de Atención en Mesón (Vendedor)"
      textoPie="Módulo de Terminal Punto de Venta."
    >
      <main className="container pos-layout">
        <section className="card pos-products">
          <h2>Registrar Nueva Venta</h2>
          <div className="form-group">
            <input
              type="text"
              placeholder="Ingresar SKU o nombre de producto..."
              value={busqueda}
              onChange={(e) => setBusqueda(e.target.value)}
            />
          </div>

          <TablaProductosPOS productos={productosFiltrados} onAgregar={agregarAlCarrito} />
        </section>

        <DetalleVenta
          carrito={carrito}
          tipoCliente={tipoCliente}
          onTipoClienteChange={setTipoCliente}
        />
      </main>
    </Layout>
  )
}

export default POS
