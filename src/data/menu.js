// Ítems del menú principal. El menú final se arma según la sesión (ver utils/menu.js).
export const itemsBase = [
  { to: '/', label: 'Inicio' },
  { to: '/catalogo', label: 'Catálogo y Stock' },
  { to: '/pos', label: 'Ventas Mesón' },
]

export const itemPanelAdmin = { to: '/admin', label: 'Panel Admin' }

export const itemPerfil = { to: '/perfil', label: 'Mi Perfil' }

export const itemAcceso = { to: '/login', label: 'Acceso Contratista', className: 'btn-login' }
