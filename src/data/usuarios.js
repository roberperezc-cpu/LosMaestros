// Credenciales estáticas (no hay backend). Solo para uso académico.
const usuarios = [
  {
    id: 1,
    nombre: 'Administrador',
    correo: 'admin@losmaestros.cl',
    password: 'Admin123',
    rol: 'admin',
    rut: '11.111.111-1',
    telefono: '+56 9 1111 1111',
    region: 'coquimbo',
    comuna: 'La Serena',
    tipoCliente: 'empresa',
  },
  {
    id: 2,
    nombre: 'Constructora Elqui',
    correo: 'contratista@losmaestros.cl',
    password: 'Maestro123',
    rol: 'contratista',
    rut: '12.345.678-5',
    telefono: '+56 9 8765 4321',
    region: 'coquimbo',
    comuna: 'Coquimbo',
    tipoCliente: 'contratista',
  },
]

export default usuarios
