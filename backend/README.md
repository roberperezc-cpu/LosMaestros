# API de Ferretería Los Maestros (Spring Boot + MySQL)

- **Sprint 1:** base del backend con 3 entidades independientes (Producto, Cliente, Venta) y CRUD completo.
- **Sprint 2:** Swagger con HATEOAS, autenticación JWT, pruebas con JUnit + DataFaker y migraciones con Flyway.

## Requisitos
- JDK 17 o superior (`java -version`)
- MySQL 8 o MariaDB (XAMPP) en ejecución
- Maven (`mvn -v`) o un IDE que lo traiga (IntelliJ IDEA)

## Puesta en marcha

### 1. Base de datos limpia (necesario para Flyway)
Flyway crea las tablas con migraciones y necesita partir de una base **vacía**.
En phpMyAdmin (pestaña SQL) ejecuta `database/reiniciar_base_de_datos.sql`.
> Si no la reinicias y la base ya tenía tablas creadas por el Sprint 1, Flyway se detiene con el error
> `Found non-empty schema(s) "losmaestros" but no schema history table`.

### 2. Credenciales de conexión
Por defecto usa `root` sin contraseña (XAMPP). Si tu MySQL tiene contraseña:
```powershell
$env:DB_USER = "root"
$env:DB_PASSWORD = "tu_contraseña"
```
Opcional: `JWT_SECRET` (mínimo 32 caracteres) para cambiar la clave con que se firman los tokens.

### 3. Ejecutar
```bash
mvn spring-boot:run
```
La API queda en http://localhost:8080.

## Flyway: versionado de la base de datos
Las migraciones están en `src/main/resources/db/migration` y se aplican en orden al arrancar:

| Versión | Archivo | Qué hace |
|---|---|---|
| V1 | `V1__crear_tablas_base.sql` | Crea `productos`, `clientes` y `ventas` |
| V2 | `V2__datos_iniciales.sql` | Carga 4 productos y 2 clientes de ejemplo |
| V3 | `V3__crear_usuarios.sql` | Crea la tabla `usuarios` (JWT) |

Flyway registra lo aplicado en la tabla `flyway_schema_history`. Un cambio futuro de la base se hace con una
migración **nueva** (por ejemplo `V4__...sql`); las ya aplicadas no se modifican. Hibernate solo **valida**
(`ddl-auto=validate`) que las entidades coincidan con las tablas.

## Swagger (documentación)
- Interfaz: **http://localhost:8080/swagger-ui.html**
- JSON OpenAPI: http://localhost:8080/v3/api-docs
- Para probar endpoints protegidos: ejecuta `POST /api/auth/login`, copia el valor de `token`, pulsa **Authorize**
  (candado) y pégalo (sin la palabra Bearer).

## Autenticación JWT
Usuarios de prueba (contraseñas cifradas con BCrypt en la tabla `usuarios`):

| Correo | Contraseña | Rol |
|---|---|---|
| `admin@losmaestros.cl` | `Admin123` | ADMIN |
| `contratista@losmaestros.cl` | `Maestro123` | USER |

Flujo: `POST /api/auth/login` devuelve un token → se envía en cada petición con el encabezado
`Authorization: Bearer <token>`. En Postman: pestaña **Authorization** → tipo **Bearer Token**.

| Ruta | Acceso |
|---|---|
| `POST /api/auth/login`, `POST /api/auth/registro` | Público. El registro crea la cuenta (`usuarios`) y la ficha del cliente (`clientes`) en una sola transacción |
| `GET /api/productos` y `GET /api/productos/{sku}` | Público (catálogo) |
| `POST`, `PUT`, `DELETE /api/productos` | Solo ADMIN |
| `GET`, `POST`, `PUT /api/clientes` y `/api/ventas` | Cualquier usuario con token |
| `DELETE /api/clientes/{id}` y `/api/ventas/{id}` | Solo ADMIN |

Sin token responde **401**; con token pero sin permiso, **403**.

## HATEOAS
Los `GET` devuelven enlaces `_links` (formato HAL). Ejemplo de `GET /api/productos/MAT-CEM-001`:
```json
{
  "id": "MAT-CEM-001",
  "nombre": "Saco de Cemento Melón 25kg",
  "_links": {
    "self":      { "href": "http://localhost:8080/api/productos/MAT-CEM-001" },
    "productos": { "href": "http://localhost:8080/api/productos" }
  }
}
```
Las listas vienen dentro de `_embedded` (por ejemplo `_embedded.productos`).

## Endpoints CRUD (los mismos 5 en cada entidad)
| Método | Ruta | Operación | Respuesta |
|---|---|---|---|
| GET | `/api/{entidad}` | Obtener todos | 200 |
| GET | `/api/{entidad}/{id}` | Buscar por ID | 200 / 404 |
| POST | `/api/{entidad}` | Guardar / crear | 201 / 400 / 409 |
| PUT | `/api/{entidad}/{id}` | Actualizar | 200 / 400 / 404 |
| DELETE | `/api/{entidad}/{id}` | Eliminar | 204 / 404 |

`{entidad}` = `productos`, `clientes` o `ventas`. Peticiones de ejemplo en `pruebas_api.http`.

## Pruebas (JUnit 5 + Mockito + DataFaker)
```bash
mvn test
```
- **Controladores** (`@WebMvcTest`): respuestas HTTP y formato HAL.
- **Servicios** (Mockito): reglas de negocio de productos, clientes, ventas y autenticación.
- **Seguridad**: acceso público, 401 sin token, 403 sin rol, 201 con ADMIN; validez, firma y vencimiento del JWT.
- **DataFaker**: `src/test/java/.../util/DatosPrueba.java` genera productos, clientes, ventas, RUT, SKU y correos aleatorios.

## Estructura
```text
controller/   recibe las peticiones HTTP (@RestController) y documenta con Swagger
assembler/    agrega los enlaces HATEOAS
service/      lógica de negocio (@Service)
repository/   interfaces que heredan de JpaRepository
model/        entidades JPA
dto/          datos de entrada con validaciones
security/     JWT: JwtService, JwtAuthFilter y SecurityConfig
exception/    errores convertidos en respuestas JSON
config/       CORS, OpenAPI y usuarios iniciales
db/migration/ migraciones Flyway
```

## Errores típicos
- `Found non-empty schema(s)` → ejecuta `database/reiniciar_base_de_datos.sql` (ver paso 1).
- `Schema-validation: missing column / wrong column type` → una entidad no coincide con las migraciones;
  como salida rápida puedes poner `spring.jpa.hibernate.ddl-auto=none`.
- `Access denied for user` → revisa `DB_USER` y `DB_PASSWORD`.
- `Communications link failure` → MySQL no está iniciado en XAMPP.
- `401` en un endpoint protegido → falta el encabezado `Authorization: Bearer <token>` o el token venció (dura 60 minutos).
