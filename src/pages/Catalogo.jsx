import { useState } from 'react'
import Layout from '../components/organisms/Layout'
import FiltroCatalogo from '../components/organisms/FiltroCatalogo'
import GrillaProductos from '../components/organisms/GrillaProductos'
import { filtrarProductos } from '../utils/filtros'

function Catalogo({ productos, onAgregarAlCarrito }) {
  const [texto, setTexto] = useState('')
  const [categoria, setCategoria] = useState('')

  const resultados = filtrarProductos(productos, texto, categoria)

  return (
    <Layout>
      <main className="container">
        <FiltroCatalogo
          texto={texto}
          categoria={categoria}
          onTextoChange={setTexto}
          onCategoriaChange={setCategoria}
        />

        <section className="catalog-section">
          <h3>Catálogo de Productos Disponibles</h3>
          <GrillaProductos productos={resultados} onAgregarAlCarrito={onAgregarAlCarrito} />
        </section>
      </main>
    </Layout>
  )
}

export default Catalogo
