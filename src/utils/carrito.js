const CLAVE_CARRITO = 'carritoLosMaestros'
const IVA = 1.19

// El carrito es una lista de { id, cantidad }. Se guarda en localStorage para que
// el menú pueda mostrar la cantidad de unidades en cualquier página.
export function obtenerCarrito() {
  try {
    return JSON.parse(localStorage.getItem(CLAVE_CARRITO)) || []
  } catch {
    return [] // el valor guardado estaba corrupto
  }
}

export function guardarCarrito(carrito) {
  localStorage.setItem(CLAVE_CARRITO, JSON.stringify(carrito))
}

// Quita del carrito los productos que ya no existen (los creados en el panel admin
// se pierden al recargar la página).
export function limpiarCarrito(carrito, productos) {
  return carrito.filter((item) => productos.some((p) => p.id === item.id))
}

export function contarUnidades(carrito) {
  return carrito.reduce((suma, item) => suma + item.cantidad, 0)
}

// Une cada ítem del carrito con los datos actuales del producto.
export function construirLineas(carrito, productos) {
  return carrito
    .map((item) => ({ producto: productos.find((p) => p.id === item.id), cantidad: item.cantidad }))
    .filter((linea) => linea.producto)
}

export function calcularTotalLineas(lineas) {
  return lineas.reduce((suma, linea) => suma + linea.producto.precio * linea.cantidad, 0)
}

// Los precios incluyen IVA: separa el neto y el IVA del total.
export function desglosarTotal(total) {
  const neto = Math.round(total / IVA)
  return { neto, iva: total - neto, total }
}
