import { useState } from 'react'
import { Routes, Route } from 'react-router-dom'

import Inicio from './pages/Inicio'
import Catalogo from './pages/Catalogo'
import DetalleProducto from './pages/DetalleProducto'
import Carrito from './pages/Carrito'
import POS from './pages/POS'
import Admin from './pages/Admin'
import Login from './pages/Login'
import Registro from './pages/Registro'
import Perfil from './pages/Perfil'
import NoEncontrada from './pages/NoEncontrada'
import RutaPrivada from './routes/RutaPrivada'
import productosIniciales from './data/productos'
import { obtenerCarrito, guardarCarrito, limpiarCarrito } from './utils/carrito'

function App() {
  // Estado único de productos: todas las páginas leen de aquí.
  // Los productos creados desde el panel admin viven solo en memoria
  // (se pierden al recargar la página).
  const [productos, setProductos] = useState(productosIniciales)

  // Carrito: lista de { id, cantidad }. Se guarda también en localStorage
  // para que el menú pueda mostrar la cantidad de unidades en cualquier página.
  const [carrito, setCarrito] = useState(limpiarCarrito(obtenerCarrito(), productosIniciales))

  const agregarProducto = (nuevoProducto) => {
    setProductos((prev) => [...prev, nuevoProducto])
  }

  const actualizarCarrito = (nuevoCarrito) => {
    guardarCarrito(nuevoCarrito)
    setCarrito(nuevoCarrito)
  }

  const agregarAlCarrito = (producto) => {
    const linea = carrito.find((item) => item.id === producto.id)
    const enCarrito = linea ? linea.cantidad : 0

    if (enCarrito >= producto.stock) {
      alert('No hay más unidades disponibles de este producto')
      return
    }

    actualizarCarrito(
      linea
        ? carrito.map((item) =>
            item.id === producto.id ? { ...item, cantidad: item.cantidad + 1 } : item,
          )
        : [...carrito, { id: producto.id, cantidad: 1 }],
    )
  }

  // delta = +1 o -1. Si la cantidad llega a 0 se quita el producto.
  const cambiarCantidad = (id, delta) => {
    const producto = productos.find((p) => p.id === id)
    const linea = carrito.find((item) => item.id === id)
    if (!producto || !linea) return

    const nuevaCantidad = linea.cantidad + delta
    if (nuevaCantidad > producto.stock) return

    actualizarCarrito(
      nuevaCantidad <= 0
        ? carrito.filter((item) => item.id !== id)
        : carrito.map((item) => (item.id === id ? { ...item, cantidad: nuevaCantidad } : item)),
    )
  }

  const quitarDelCarrito = (id) => {
    actualizarCarrito(carrito.filter((item) => item.id !== id))
  }

  // Descuenta del inventario lo comprado y vacía el carrito.
  const confirmarCompra = () => {
    setProductos((prev) =>
      prev.map((producto) => {
        const linea = carrito.find((item) => item.id === producto.id)
        return linea ? { ...producto, stock: producto.stock - linea.cantidad } : producto
      }),
    )
    actualizarCarrito([])
  }

  return (
    <Routes>
      <Route path="/" element={<Inicio />} />
      <Route
        path="/catalogo"
        element={<Catalogo productos={productos} onAgregarAlCarrito={agregarAlCarrito} />}
      />
      <Route
        path="/catalogo/:id"
        element={<DetalleProducto productos={productos} onAgregarAlCarrito={agregarAlCarrito} />}
      />
      <Route
        path="/carrito"
        element={
          <Carrito
            productos={productos}
            carrito={carrito}
            onCambiarCantidad={cambiarCantidad}
            onQuitar={quitarDelCarrito}
            onConfirmarCompra={confirmarCompra}
          />
        }
      />
      <Route path="/pos" element={<POS productos={productos} />} />
      <Route
        path="/admin"
        element={
          <RutaPrivada rolRequerido="admin">
            <Admin productos={productos} onAgregarProducto={agregarProducto} />
          </RutaPrivada>
        }
      />
      <Route path="/login" element={<Login />} />
      <Route path="/registro" element={<Registro />} />
      <Route
        path="/perfil"
        element={
          <RutaPrivada>
            <Perfil />
          </RutaPrivada>
        }
      />
      <Route path="*" element={<NoEncontrada />} />
    </Routes>
  )
}

export default App
