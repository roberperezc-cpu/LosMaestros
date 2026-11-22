import categorias from '../data/categorias'
import imagenGenerica from '../assets/img/producto-generico.svg'
import { ARCHIVO_IMAGEN_GENERICA } from './productosApi'

// Convierte los datos del formulario (todo texto) en un producto del catálogo.
// Al crear, se usa la imagen genérica (no se cargan archivos). Al editar, "original" es el
// producto que ya existía: se conservan su imagen y sus especificaciones (solo cambia la marca).
export function crearProducto(datos, original = null) {
  const categoria = categorias.find((c) => c.value === datos.categoria)
  const marca = datos.marca.trim()

  const especificaciones = { ...(original ? original.especificaciones : {}) }
  if (marca) {
    especificaciones.Marca = marca
  } else {
    delete especificaciones.Marca
  }

  return {
    id: datos.sku.trim().toUpperCase(),
    nombre: datos.nombre.trim(),
    categoria: datos.categoria,
    categoriaNombre: categoria ? categoria.label : datos.categoria,
    precio: Number(datos.precio),
    stock: Number(datos.stock),
    stockMinimo: Number(datos.stockMinimo),
    ubicacion: datos.ubicacion.trim(),
    imagen: original && original.imagen ? original.imagen : imagenGenerica,
    imagenArchivo: original && original.imagenArchivo ? original.imagenArchivo : ARCHIVO_IMAGEN_GENERICA,
    especificaciones,
  }
}
