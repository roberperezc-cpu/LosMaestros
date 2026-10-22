// "$4.890", "$58.990", etc.
export function formatearPrecio(valor) {
  return `$${valor.toLocaleString('es-CL')}`
}
