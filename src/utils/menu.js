import { itemsBase, itemPanelAdmin, itemAcceso } from '../data/menu'

// Arma el menú según la sesión:
// - sin sesión: "Acceso Contratista"
// - con sesión: "Cerrar sesión (nombre)"; el Panel Admin solo aparece para el rol admin
export function construirMenu(sesion, onCerrarSesion) {
  const items = [...itemsBase]

  if (sesion && sesion.rol === 'admin') {
    items.push(itemPanelAdmin)
  }

  if (sesion) {
    items.push({
      to: '/login',
      label: `Cerrar sesión (${sesion.nombre})`,
      className: 'btn-login',
      onClick: onCerrarSesion,
    })
  } else {
    items.push(itemAcceso)
  }

  return items
}
