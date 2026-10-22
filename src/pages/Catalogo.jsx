import { useState } from 'react'
import Layout from '../components/Layout'
import FiltroCatalogo from '../components/FiltroCatalogo'
import ListaProductos from '../components/ListaProductos'
import productos from '../data/productos'
import { filtrarProductos } from '../utils/filtros'

function Catalogo() {
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
          <ListaProductos productos={resultados} />
        </section>
      </main>
    </Layout>
  )
}

export default Catalogo
