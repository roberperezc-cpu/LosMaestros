# Ferretería Los Maestros: instrucciones de ejecución

Aplicación Full Stack: **React** (frontend) + **Spring Boot** (backend) + **MySQL** (base de datos).
Los tres componentes se ejecutan por separado: MySQL en XAMPP, el backend en IntelliJ y el frontend en VS Code.

```text
LosMaestros/
├── src/, package.json, ...      Frontend React (raíz del proyecto)
└── backend/                     Backend Spring Boot
    └── database/                Scripts SQL
```

## Requisitos
| Programa | Versión | Para qué |
|---|---|---|
| XAMPP (MySQL / MariaDB) | cualquiera reciente | Base de datos |
| JDK | 17 o superior (`java -version`) | Backend |
| IntelliJ IDEA (trae Maven) o Maven (`mvn -v`) | | Backend |
| Node.js | LTS reciente (`node -v`) | Frontend |
| VS Code | | Frontend |

## Paso 1: encender MySQL
Abre el **XAMPP Control Panel** y pulsa **Start** en **MySQL** (puerto 3306). Apache solo hace falta para usar phpMyAdmin
(`http://localhost/phpmyadmin`).

## Paso 2: base de datos (elige UNA opción)

**Opción A (recomendada): automática con Flyway.** No hagas nada: si la base `losmaestros` no existe o está vacía,
el backend la crea al arrancar (4 migraciones en `backend/src/main/resources/db/migration`) y carga los datos de ejemplo.
Si la base ya existía de una versión anterior y el backend se detiene con el error `Found non-empty schema(s)`, bórrala
ejecutando `backend/database/reiniciar_base_de_datos.sql` en phpMyAdmin (pestaña **SQL**) y vuelve a arrancar.

**Opción B: con el script SQL.** En phpMyAdmin, pestaña **SQL**, pega y ejecuta `backend/database/losmaestros_completo.sql`.
Crea la base, las 4 tablas (`productos`, `clientes`, `ventas`, `usuarios`) y todos los datos, incluidos los usuarios con la
contraseña cifrada. Después arranca el backend normalmente.

## Paso 3: backend (IntelliJ)
1. En IntelliJ: **File → Open** y elige la carpeta `backend`. Espera a que Maven descargue las dependencias (la primera vez
   necesita Internet).
2. Abre `LosMaestrosApiApplication` y pulsa **Run**. Debe quedar escuchando en `http://localhost:8080`.
   Alternativa por consola, dentro de `backend`: `mvn spring-boot:run`.
3. Si tu MySQL tiene contraseña (XAMPP por defecto no tiene), define antes de arrancar:
   ```powershell
   $env:DB_USER = "root"
   $env:DB_PASSWORD = "tu_contraseña"
   ```

Comprobación: abre **http://localhost:8080/swagger-ui.html** (documentación y pruebas de los endpoints).

## Paso 4: frontend (VS Code)
1. En VS Code: **File → Open Folder** y elige la carpeta raíz del proyecto (la que tiene `package.json`).
2. En la terminal integrada:
   ```powershell
   npm install
   npm run dev
   ```
   En PowerShell, si aparece un error de "ejecución de scripts deshabilitada", usa `npm.cmd install` y `npm.cmd run dev`.
3. Abre la dirección que muestra la consola, normalmente **http://localhost:5173**.
   (Si el puerto está ocupado, Vite usa otro, por ejemplo 5174; ambos están autorizados en el backend.)

## Usuarios de prueba
| Correo | Contraseña | Rol | Qué puede hacer |
|---|---|---|---|
| `admin@losmaestros.cl` | `Admin123` | ADMIN | Panel de control: crear, editar y eliminar productos. No tiene ficha de cliente, así que no compra |
| `contratista@losmaestros.cl` | `Maestro123` | USER | Comprar (checkout) y ver su perfil. No puede administrar productos |

Además, cualquier persona puede crear una cuenta en `/registro` (rol USER, con ficha de cliente).

## Qué se puede probar
| Funcionalidad | Dónde |
|---|---|
| Catálogo (datos de MySQL) | `/catalogo` |
| Registro (crea usuario y cliente en MySQL) | `/registro` |
| Inicio de sesión con JWT | `/login` |
| CRUD de productos (solo ADMIN) | `/admin` |
| Checkout: descuenta el stock y registra las ventas | `/carrito` (con sesión de cliente) |
| Documentación y pruebas de la API | `http://localhost:8080/swagger-ui.html` |

El token JWT se guarda en el navegador (F12 → Application → Local Storage → `sesionLosMaestros`) y dura **60 minutos**.
Cuando vence, la aplicación cierra la sesión y lleva al login con un aviso.

## Pruebas automatizadas
- Backend (dentro de `backend`): `mvn test`, o en IntelliJ clic derecho sobre `src/test/java` → **Run All Tests**.
- Frontend: `npm test`.

## Problemas frecuentes
| Síntoma | Solución |
|---|---|
| `Communications link failure` en el backend | MySQL no está iniciado en XAMPP |
| `Access denied for user 'root'` | Define `DB_USER` y `DB_PASSWORD` (paso 3) |
| `Found non-empty schema(s)` | Ejecuta `backend/database/reiniciar_base_de_datos.sql` y vuelve a arrancar |
| `Port 8080 was already in use` | Cierra el otro programa que usa el puerto 8080 |
| El frontend muestra los 4 productos pero no los de la base | El backend no está encendido; revisa el paso 3 |
| `No se pudo conectar con el servidor` al crear o comprar | El backend está apagado o el puerto 8080 está bloqueado |
| Error de CORS en la consola del navegador | El frontend debe abrirse en `localhost:5173` o `5174` |
| 401 o "sesión expiró" | El token venció: inicia sesión de nuevo |
