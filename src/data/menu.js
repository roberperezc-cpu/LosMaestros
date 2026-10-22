// Menú principal. En las páginas internas el HTML original mostraba
// "Consulta de Stock" y omitía el Catálogo; aquí se unifica en un solo menú.
const itemsMenu = [
  { to: '/', label: 'Inicio' },
  { to: '/catalogo', label: 'Catálogo y Stock' },
  { to: '/pos', label: 'Ventas Mesón' },
  { to: '/admin', label: 'Panel Admin' },
  { to: '/login', label: 'Acceso Contratista', className: 'btn-login' },
]

export default itemsMenu
