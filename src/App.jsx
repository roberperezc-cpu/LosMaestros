import { Routes, Route } from 'react-router-dom'

import ScrollToTop from './components/ScrollToTop'
import Inicio from './pages/Inicio'
import Catalogo from './pages/Catalogo'
import DetalleProducto from './pages/DetalleProducto'
import POS from './pages/POS'
import Admin from './pages/Admin'
import Login from './pages/Login'
import NoEncontrada from './pages/NoEncontrada'

function App() {
  return (
    <>
      <ScrollToTop />
      <Routes>
        <Route path="/" element={<Inicio />} />
        <Route path="/catalogo" element={<Catalogo />} />
        <Route path="/catalogo/:id" element={<DetalleProducto />} />
        <Route path="/pos" element={<POS />} />
        <Route path="/admin" element={<Admin />} />
        <Route path="/login" element={<Login />} />
        <Route path="*" element={<NoEncontrada />} />
      </Routes>
    </>
  )
}

export default App
