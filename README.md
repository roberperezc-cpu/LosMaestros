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

## Estructura
```text
src/
├── main.jsx / App.jsx        # entrada y rutas (react-router-dom)
├── styles/styles.css         # tus estilos originales, intactos
├── styles/extras.css         # reemplaza los style="" inline del HTML
├── data/                     # productos, categorías, menú, contratistas
├── utils/                    # estado de stock, filtros, formato de precio
├── components/               # Header, Footer, Layout, TarjetaProducto, ...
└── pages/                    # Inicio, Catalogo, DetalleProducto, POS, Admin, Login
```

## Rutas
`/` · `/catalogo` · `/catalogo/:id` · `/pos` · `/admin` · `/login`

Pendiente (igual que en la versión HTML): login real, "Confirmar venta", "Ver Historial".
