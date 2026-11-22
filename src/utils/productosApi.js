// La API guarda la imagen como nombre de archivo y las especificaciones como texto JSON,
// y responde en formato HAL (_embedded / _links). Aquí se convierte todo al formato
// que ya usa la interfaz (imagen importada y especificaciones como objeto).

export const ARCHIVO_IMAGEN_GENERICA = 'producto-generico.svg'

// Todas las imágenes de src/assets/img, indexadas por su ruta.
const imagenes = import.meta.glob('../assets/img/*', { eager: true, import: 'default' })

export function resolverImagen(nombreArchivo) {
  return (
    imagenes[`../assets/img/${nombreArchivo}`] ||
    imagenes[`../assets/img/${ARCHIVO_IMAGEN_GENERICA}`]
  )
}

function leerEspecificaciones(texto) {
  if (!texto) return {}
  try {
    const objeto = JSON.parse(texto)
    return objeto && typeof objeto === 'object' ? objeto : {}
  } catch {
    return {} // el texto guardado no era un JSON válido
  }
}

// GET /api/productos devuelve { _embedded: { productos: [...] }, _links: {...} }.
// Si no hay productos, _embedded no viene.
export function extraerLista(datos) {
  return (datos && datos._embedded && datos._embedded.productos) || []
}

// De la API hacia la interfaz.
export function desdeApi(producto) {
  return {
    id: producto.id,
    nombre: producto.nombre,
    categoria: producto.categoria,
    categoriaNombre: producto.categoriaNombre,
    precio: producto.precio,
    stock: producto.stock,
    stockMinimo: producto.stockMinimo,
    ubicacion: producto.ubicacion,
    imagen: resolverImagen(producto.imagen),
    imagenArchivo: producto.imagen || null,
    especificaciones: leerEspecificaciones(producto.especificaciones),
  }
}

// De la interfaz hacia la API (lo que se envía en POST y PUT).
export function haciaApi(producto) {
  const especificaciones = producto.especificaciones || {}

  return {
    id: producto.id,
    nombre: producto.nombre,
    categoria: producto.categoria,
    categoriaNombre: producto.categoriaNombre,
    precio: producto.precio,
    stock: producto.stock,
    stockMinimo: producto.stockMinimo,
    ubicacion: producto.ubicacion,
    imagen: producto.imagenArchivo || ARCHIVO_IMAGEN_GENERICA,
    especificaciones: Object.keys(especificaciones).length > 0 ? JSON.stringify(especificaciones) : null,
  }
}
