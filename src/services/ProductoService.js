import api from './api'
import { desdeApi, extraerLista, haciaApi } from '../utils/productosApi'

// Las 5 operaciones del CRUD contra /api/productos.
// GET es público; POST, PUT y DELETE requieren el token de un administrador.
class ProductoService {
  obtenerTodos() {
    return api.get('/productos').then((respuesta) => extraerLista(respuesta.data).map(desdeApi))
  }

  buscarPorId(id) {
    return api.get(`/productos/${id}`).then((respuesta) => desdeApi(respuesta.data))
  }

  crear(producto) {
    return api.post('/productos', haciaApi(producto)).then((respuesta) => desdeApi(respuesta.data))
  }

  actualizar(id, producto) {
    return api.put(`/productos/${id}`, haciaApi(producto)).then((respuesta) => desdeApi(respuesta.data))
  }

  eliminar(id) {
    return api.delete(`/productos/${id}`)
  }
}

export default new ProductoService()
