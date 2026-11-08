# API de Ferretería Los Maestros (Spring Boot + MySQL)

Semana 1: base del backend con 3 entidades independientes (**Producto, Cliente, Venta**),
sin relaciones entre ellas, y CRUD completo en cada una.

## Requisitos
- JDK 17 o superior (`java -version`)
- MySQL 8 en ejecución (Workbench, XAMPP o Docker)
- Maven (`mvn -v`) o un IDE que lo traiga (IntelliJ IDEA)

## 1. Base de datos
Ejecuta `database/crear_base_de_datos.sql` en MySQL (crea la base `losmaestros`).
Si no lo haces, Spring Boot la crea sola al arrancar.

## 2. Credenciales de conexión
Están en `src/main/resources/application.properties`. Usuario y contraseña se leen de variables
de entorno, para no subirlos a GitHub. Por defecto: usuario `root`, sin contraseña.

```powershell
$env:DB_USER = "root"
$env:DB_PASSWORD = "tu_contraseña"
```

## 3. Ejecutar
```bash
mvn spring-boot:run
```
La API queda en http://localhost:8080. Al primer arranque se crean las tablas
(`productos`, `clientes`, `ventas`) y se cargan 4 productos y 2 clientes de ejemplo.

## Endpoints (los mismos 5 en cada entidad)
| Método | Ruta | Operación | Respuesta |
|---|---|---|---|
| GET | `/api/{entidad}` | Obtener todos | 200 |
| GET | `/api/{entidad}/{id}` | Buscar por ID | 200 / 404 |
| POST | `/api/{entidad}` | Guardar / crear | 201 / 400 / 409 |
| PUT | `/api/{entidad}/{id}` | Actualizar | 200 / 400 / 404 |
| DELETE | `/api/{entidad}/{id}` | Eliminar | 204 / 404 |

`{entidad}` = `productos`, `clientes` o `ventas`. Las peticiones de ejemplo están en `pruebas_api.http`.

## Entidades
| Entidad | Id | Campos principales |
|---|---|---|
| Producto | SKU (texto, ej: HER-TAL-042) | nombre, categoría, precio, stock, stockMinimo, ubicación, imagen, especificaciones |
| Cliente | autoincremental | rut (único), nombre, correo (único), teléfono, tipoCliente, región, comuna |
| Venta | autoincremental | fecha, clienteId, productoId, cantidad, precioUnitario, total, tipoEntrega, metodoPago |

En `Venta`, `clienteId` y `productoId` son valores simples (no hay `@ManyToOne`): así las tres entidades quedan independientes.

## Pruebas
```bash
mvn test
```
16 pruebas de la capa web (sin base de datos), con patrón Arrange / Act / Assert.

## Estructura
```text
controller/   recibe las peticiones HTTP (@RestController)
service/      lógica de negocio (@Service): obtenerTodos, buscarPorId, guardar, actualizar, eliminar
repository/   interfaces que heredan de JpaRepository (sin métodos propios)
model/        entidades JPA (las tablas)
dto/          datos de entrada con validaciones
exception/    errores convertidos en respuestas JSON
config/       CORS y datos iniciales
```

## Errores típicos
- `Access denied for user` → usuario o contraseña incorrectos (revisa las variables `DB_USER` y `DB_PASSWORD`).
- `Communications link failure` → MySQL no está encendido o el puerto no es 3306.
- `Port 8080 was already in use` → otro programa usa el puerto; ciérralo o cambia `server.port`.
