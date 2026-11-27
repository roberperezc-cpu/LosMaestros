import '@testing-library/jest-dom'

// En las pruebas no existe el backend: los servicios HTTP se reemplazan por simulaciones.
// Por defecto "fallan" (como si la API estuviera apagada) y cada prueba puede cambiar
// su respuesta con mockResolvedValueOnce / mockRejectedValueOnce.
vi.mock('./src/services/ProductoService.js', () => ({
  default: {
    obtenerTodos: vi.fn(() => Promise.reject(new Error('API no disponible en las pruebas'))),
    buscarPorId: vi.fn(() => Promise.reject(new Error('API no disponible en las pruebas'))),
    crear: vi.fn(() => Promise.reject(new Error('API no disponible en las pruebas'))),
    actualizar: vi.fn(() => Promise.reject(new Error('API no disponible en las pruebas'))),
    eliminar: vi.fn(() => Promise.reject(new Error('API no disponible en las pruebas'))),
  },
}))

vi.mock('./src/services/AuthService.js', () => ({
  default: {
    login: vi.fn(() => Promise.reject(new Error('API no disponible en las pruebas'))),
    registro: vi.fn(() => Promise.reject(new Error('API no disponible en las pruebas'))),
  },
}))

vi.mock('./src/services/PedidoService.js', () => ({
  default: {
    confirmar: vi.fn(() => Promise.reject(new Error('API no disponible en las pruebas'))),
  },
}))
