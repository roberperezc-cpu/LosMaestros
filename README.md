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
`/` · `/catalogo` · `/catalogo/:id` · `/pos` · `/admin` (privada, solo rol admin) · `/login` · `/registro` · `/perfil` (privada, requiere sesión)

## Usuarios de prueba (credenciales estáticas)
| Rol | Correo | Contraseña |
|---|---|---|
| admin | admin@losmaestros.cl | Admin123 |
| contratista | contratista@losmaestros.cl | Maestro123 |

La sesión se guarda en `localStorage` (clave `sesionLosMaestros`). Los usuarios creados en `/registro` se guardan en `localStorage` (clave `usuariosRegistrados`) y pueden iniciar sesión.

## Panel Admin
Desde `/admin` se pueden crear productos (SKU, nombre, categoría, precio, stock, stock mínimo, ubicación y marca). Se guardan solo en memoria (se pierden al recargar) y usan una imagen genérica.

Pendiente: "Confirmar venta", "Ver Historial".
