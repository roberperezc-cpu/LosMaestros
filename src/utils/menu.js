import { itemsBase, itemCarrito, itemPanelAdmin, itemPerfil, itemAcceso } from '../data/menu'

// Arma el menú según la sesión:
// - siempre: "Carrito" (con la cantidad de unidades si hay)
// - sin sesión: "Acceso Contratista"
// - con sesión: "Mi Perfil" y "Cerrar sesión (nombre)"; el Panel Admin solo aparece para el rol admin
export function construirMenu(sesion, onCerrarSesion, unidadesCarrito = 0) {
  const etiquetaCarrito =
    unidadesCarrito > 0 ? `${itemCarrito.label} (${unidadesCarrito})` : itemCarrito.label
  const items = [...itemsBase, { ...itemCarrito, label: etiquetaCarrito }]

  if (sesion && sesion.rol === 'admin') {
    items.push(itemPanelAdmin)
  }

  if (sesion) {
    items.push(itemPerfil)
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
