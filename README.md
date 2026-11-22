# Ferretería Los Maestros (React + Vite)

Migración del sitio HTML puro a React. Mantiene `src/styles/styles.css` sin cambios.

## Comandos
```bash
npm install
npm run dev      # desarrollo
npm run build    # producción
npm test         # tests (Vitest + Testing Library)
npm run lint
```

## Estructura (Atomic Design)
```text
src/
├── main.jsx / App.jsx          # entrada, rutas y estado de productos
├── styles/                     # styles.css (original, intacto) + extras.css
├── data/                       # productos, categorías, menú, servicios, contratistas
├── utils/                      # estado de stock, filtros, formato de precio
├── components/
│   ├── atoms/                  # Boton, BotonEnlace, Entrada, Selector, Precio, InsigniaStock, ...
│   ├── molecules/              # CampoFormulario, TarjetaProducto, MenuPrincipal, CajaStock, ...
│   └── organisms/              # Header, Footer, Layout, Hero, FiltroCatalogo, DetalleVenta, ...
├── routes/                     # RutaPrivada (protege /admin)
└── pages/                      # Inicio, Catalogo, DetalleProducto, POS, Admin, Login, NoEncontrada
```

## Rutas
`/` · `/catalogo` · `/catalogo/:id` · `/pos` · `/admin` (privada, solo rol admin) · `/login` · `/carrito` · `/registro` · `/perfil` (privada, requiere sesión)

## Usuarios de prueba (credenciales estáticas)
| Rol | Correo | Contraseña |
|---|---|---|
| admin | admin@losmaestros.cl | Admin123 |
| contratista | contratista@losmaestros.cl | Maestro123 |

La sesión se guarda en `localStorage` (clave `sesionLosMaestros`). Los usuarios creados en `/registro` se guardan en `localStorage` (clave `usuariosRegistrados`) y pueden iniciar sesión.

## Panel Admin
Desde `/admin` se pueden crear productos (SKU, nombre, categoría, precio, stock, stock mínimo, ubicación y marca). Se guardan solo en memoria (se pierden al recargar) y usan una imagen genérica.

Pendiente: "Confirmar venta", "Ver Historial".

## Carrito de compras
Desde el catálogo o el detalle se agregan productos al carrito (`/carrito`). El checkout valida RUT, teléfono, tipo de entrega y método de pago; al confirmar descuenta el stock en memoria y vacía el carrito.

## Conexión con el backend (Spring Boot + MySQL)

El catálogo y el panel de administración se conectan a la API (`http://localhost:8080/api`) con Axios.
La dirección se puede cambiar con `VITE_API_URL` (ver `.env.example`).

**Para probarlo:** enciende MySQL (XAMPP), arranca el backend (`backend/`) y luego `npm install` y `npm run dev`.
Inicia sesión como administrador (`admin@losmaestros.cl` / `Admin123`): el login se hace contra la API y el
token JWT se envía en cada petición protegida. Sin el backend, la interfaz sigue funcionando con los datos locales.

| Operación | Dónde se hace | Llamada a la API |
|---|---|---|
| Listar | Catálogo y panel `/admin` | `GET /api/productos` (público) |
| Buscar por ID | `/admin/productos/:id/editar` | `GET /api/productos/{id}` |
| Crear | `/admin/productos/nuevo` | `POST /api/productos` (ADMIN) |
| Editar | `/admin/productos/:id/editar` | `PUT /api/productos/{id}` (ADMIN) |
| Eliminar | Botón "Eliminar" en `/admin` | `DELETE /api/productos/{id}` (ADMIN) |

```text
src/services/   ProductoService (CRUD), AuthService y SesionService (login), api.js (Axios + token)
src/utils/      productosApi.js (adapta la respuesta HAL de la API), errores.js (mensajes de error)
```

Pendiente de integrar: el registro de usuarios, el carrito y el descuento de stock en el checkout siguen siendo locales.
