import categorias from '../data/categorias'
import imagenGenerica from '../assets/img/producto-generico.svg'

// Convierte los datos del formulario (todo texto) en un producto del catálogo.
// No se cargan archivos: todos los productos nuevos usan la misma imagen genérica.
export function crearProducto(datos) {
  const categoria = categorias.find((c) => c.value === datos.categoria)
  const marca = datos.marca.trim()

  return {
    id: datos.sku.trim().toUpperCase(),
    nombre: datos.nombre.trim(),
    categoria: datos.categoria,
    categoriaNombre: categoria ? categoria.label : datos.categoria,
    precio: Number(datos.precio),
    stock: Number(datos.stock),
    stockMinimo: Number(datos.stockMinimo),
    ubicacion: datos.ubicacion.trim(),
    imagen: imagenGenerica,
    especificaciones: marca ? { Marca: marca } : {},
  }
}
