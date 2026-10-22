import { useState } from 'react'
import { Routes, Route } from 'react-router-dom'

import Inicio from './pages/Inicio'
import Catalogo from './pages/Catalogo'
import DetalleProducto from './pages/DetalleProducto'
import POS from './pages/POS'
import Admin from './pages/Admin'
import Login from './pages/Login'
import NoEncontrada from './pages/NoEncontrada'
import RutaPrivada from './routes/RutaPrivada'
import productosIniciales from './data/productos'

function App() {
  // Estado único de productos: todas las páginas leen de aquí.
  // Los productos creados desde el panel admin viven solo en memoria
  // (se pierden al recargar la página).
  const [productos, setProductos] = useState(productosIniciales)

  const agregarProducto = (nuevoProducto) => {
    setProductos((prev) => [...prev, nuevoProducto])
  }

  return (
    <Routes>
      <Route path="/" element={<Inicio />} />
      <Route path="/catalogo" element={<Catalogo productos={productos} />} />
      <Route path="/catalogo/:id" element={<DetalleProducto productos={productos} />} />
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
      <Route path="*" element={<NoEncontrada />} />
    </Routes>
  )
}

export default App
