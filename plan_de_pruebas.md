# Plan de Pruebas — Ferretería Los Maestros

**Nombre del Estudiante:** [Roberto Pérez]  
**Componente / Módulo Principal:** Catálogo, Carrito y Checkout, Login y Registro, Panel Admin, Rutas protegidas, POS, Perfil.  
**Fecha:** 24-10-2026

## Alcance y herramientas

- **Herramientas:** Vitest, React Testing Library y jsdom (entorno de navegador simulado).
- **Patrón:** todas las pruebas siguen Arrange (preparación), Act (acción) y Assert (verificación).
- **Cómo ejecutarlas:** `npm test` (ejecuta `vitest run`).
- **Total de pruebas:** 90 automatizadas, distribuidas en 19 archivos.

**Funcionalidades críticas evaluadas:** inventario y filtrado de productos, inicio y cierre de sesión con `localStorage`, protección de la ruta `/admin`, creación de productos en memoria, registro con RUT y comuna dependiente, carrito de compras con control de stock, checkout con descuento de inventario y punto de venta (POS).

## 1. Lógica de inventario (`src/utils/utils.test.js`)

| ID | Componente (describe) | Caso de Prueba (it / test) | Preparación (Arrange: props, mocks) | Acción (Act: fireEvent, render) | Resultado Esperado (Assert: expect) | Estado (Pasa / Falla) |
| :--- | :--- | :--- | :--- | :--- | :--- | :--- |
| PU-001 | obtenerEstadoStock | marca Agotado cuando el stock es 0 | Producto con stock 0 y stock mínimo 5 | Llamar a `obtenerEstadoStock(producto)` | Devuelve `{ clase: 'stock-out', texto: 'Agotado' }` | ✅ |
| PU-002 | obtenerEstadoStock | marca Bajo Stock cuando está en o bajo el mínimo | Producto con stock 5 y stock mínimo 5 | Llamar a `obtenerEstadoStock(producto)` | El texto devuelto es `Bajo Stock` | ✅ |
| PU-003 | obtenerEstadoStock | marca En Stock cuando supera el mínimo | Producto con stock 142 y stock mínimo 20 | Llamar a `obtenerEstadoStock(producto)` | Devuelve `{ clase: 'stock-ok', texto: 'En Stock' }` | ✅ |
| PU-004 | productosParaReponer | devuelve el taladro (bajo stock) y el tubo (agotado) | Catálogo inicial de productos | Llamar a `productosParaReponer(inventario)` | Los SKU devueltos son `['HER-TAL-042', 'GAS-PVC-110']` | ✅ |
| PU-005 | filtrarProductos | sin filtros devuelve todo | Catálogo inicial de productos | Llamar a `filtrarProductos(inventario)` | La cantidad devuelta es igual al total del catálogo | ✅ |
| PU-006 | filtrarProductos | busca por nombre sin distinguir mayúsculas | Texto de búsqueda `TALADRO` | Llamar a `filtrarProductos(productos, texto)` | Devuelve solo el SKU `HER-TAL-042` | ✅ |
| PU-007 | filtrarProductos | busca por SKU | Texto de búsqueda `cab-002` | Llamar a `filtrarProductos(productos, texto)` | Devuelve exactamente 1 producto | ✅ |
| PU-008 | filtrarProductos | filtra por categoría | Categoría `gasfiteria` sin texto | Llamar a `filtrarProductos(productos, '', categoria)` | Devuelve solo el SKU `GAS-PVC-110` | ✅ |
| PU-009 | filtrarProductos | combina texto y categoría | Texto `cemento` y categoría `gasfiteria` | Llamar a `filtrarProductos(productos, texto, categoria)` | No devuelve ningún producto (0 resultados) | ✅ |

## 2. Validaciones de inicio de sesión (`src/utils/validaciones.test.js`)

| ID | Componente (describe) | Caso de Prueba (it / test) | Preparación (Arrange: props, mocks) | Acción (Act: fireEvent, render) | Resultado Esperado (Assert: expect) | Estado (Pasa / Falla) |
| :--- | :--- | :--- | :--- | :--- | :--- | :--- |
| PU-010 | validarCorreo | rechaza un correo vacío | Valor compuesto solo por espacios | Llamar a `validarCorreo(valor)` | Devuelve `El correo es obligatorio.` | ✅ |
| PU-011 | validarCorreo | rechaza un correo sin formato válido | Valor `correo-sin-arroba` | Llamar a `validarCorreo(valor)` | El mensaje contiene `correo válido` | ✅ |
| PU-012 | validarCorreo | acepta un correo válido | Valor `admin@losmaestros.cl` | Llamar a `validarCorreo(valor)` | Devuelve cadena vacía (sin error) | ✅ |
| PU-013 | validarPassword | rechaza una contraseña de menos de 6 caracteres | Valor `123` | Llamar a `validarPassword(valor)` | El mensaje contiene `al menos 6` | ✅ |
| PU-014 | validarLogin | devuelve un error por cada campo inválido | Datos con correo y contraseña vacíos | Llamar a `validarLogin(datos)` | El objeto de errores tiene las claves `correo` y `password` | ✅ |
| PU-015 | validarLogin | devuelve un objeto vacío cuando todo es válido | Correo y contraseña válidos (`Admin123`) | Llamar a `validarLogin(datos)` | Devuelve `{}` | ✅ |

## 3. Sesión y menú (`src/utils/sesion.test.js`, `src/utils/menu.test.js`)

| ID | Componente (describe) | Caso de Prueba (it / test) | Preparación (Arrange: props, mocks) | Acción (Act: fireEvent, render) | Resultado Esperado (Assert: expect) | Estado (Pasa / Falla) |
| :--- | :--- | :--- | :--- | :--- | :--- | :--- |
| PU-016 | sesión | autentica al administrador con credenciales correctas y sin exponer la contraseña | Correo `admin@losmaestros.cl` y contraseña `Admin123` | Llamar a `autenticar(correo, password)` | Devuelve el usuario con rol `admin` y sin la propiedad `password` | ✅ |
| PU-017 | sesión | devuelve null con credenciales incorrectas | Correo válido y contraseña equivocada | Llamar a `autenticar(correo, 'clave-equivocada')` | Devuelve `null` | ✅ |
| PU-018 | sesión | guarda y recupera la sesión desde localStorage | Objeto usuario de ejemplo; localStorage limpio | Llamar a `guardarSesion(usuario)` | `obtenerSesion()` devuelve el mismo usuario | ✅ |
| PU-019 | sesión | cerrarSesion elimina la sesión guardada | Sesión guardada previamente | Llamar a `cerrarSesion()` | `obtenerSesion()` devuelve `null` | ✅ |
| PU-020 | construirMenu | sin sesión muestra "Acceso Contratista" y oculta el Panel Admin | Sesión `null` | Llamar a `construirMenu(null)` | Incluye `Acceso Contratista` y no incluye `Panel Admin` | ✅ |
| PU-021 | construirMenu | con sesión de administrador muestra Panel Admin y Cerrar sesión | Sesión con rol `admin` | Llamar a `construirMenu(sesion, fn)` | Incluye `Panel Admin` y `Cerrar sesión (Administrador)`; no incluye `Acceso Contratista` | ✅ |
| PU-022 | construirMenu | con sesión de contratista no muestra el Panel Admin | Sesión con rol `contratista` | Llamar a `construirMenu(sesion, fn)` | No incluye `Panel Admin` | ✅ |
| PU-023 | construirMenu (carrito) | muestra "Carrito" sin cantidad cuando está vacío | Cantidad de unidades en el carrito = 0 | Llamar a `construirMenu(null, fn, 0)` | Incluye la etiqueta `Carrito` | ✅ |
| PU-024 | construirMenu (carrito) | muestra la cantidad de unidades cuando hay productos | Cantidad de unidades en el carrito = 3 | Llamar a `construirMenu(null, fn, 3)` | Incluye la etiqueta `Carrito (3)` | ✅ |

## 4. Productos del panel admin (`src/utils/productos.test.js`)

| ID | Componente (describe) | Caso de Prueba (it / test) | Preparación (Arrange: props, mocks) | Acción (Act: fireEvent, render) | Resultado Esperado (Assert: expect) | Estado (Pasa / Falla) |
| :--- | :--- | :--- | :--- | :--- | :--- | :--- |
| PU-025 | validarProducto | acepta un producto con todos los datos correctos | Datos válidos (SKU `her-mar-010`, precio 9990, stock 25) | Llamar a `validarProducto(datos, productos)` | Devuelve `{}` (sin errores) | ✅ |
| PU-026 | validarProducto | rechaza un SKU con formato inválido | SKU `martillo1` | Llamar a `validarProducto(datos, productos)` | El error de `sku` contiene `formato inválido` | ✅ |
| PU-027 | validarProducto | rechaza un SKU que ya existe, sin importar mayúsculas | SKU `mat-cem-001` (ya existe en el catálogo) | Llamar a `validarProducto(datos, productos)` | Error `Ya existe un producto con ese SKU.` | ✅ |
| PU-028 | validarProducto | rechaza precio 0, negativo o con decimales | Precios `0`, `-500`, `99.5` y vacío | Validar cada precio con `validarProducto` | Cada resultado tiene error en `precio` | ✅ |
| PU-029 | validarProducto | permite stock 0 pero rechaza stock negativo | Stock `0` y stock `-3` | Validar ambos casos | Stock 0 sin error; stock -3 con error en `stock` | ✅ |
| PU-030 | crearProducto | convierte los textos del formulario a un producto del catálogo | Datos del formulario como texto (con espacios y SKU en minúsculas) | Llamar a `crearProducto(datos)` | Producto con SKU en mayúsculas, nombre sin espacios, precio y stock numéricos, categoría `Herramientas Manuales` y marca en especificaciones | ✅ |
| PU-031 | crearProducto | asigna una imagen genérica y no agrega especificaciones sin marca | Datos válidos con marca vacía | Llamar a `crearProducto(datos)` | La imagen existe y las especificaciones son `{}` | ✅ |

## 5. Registro de usuarios (`src/utils/registro.test.js`)

| ID | Componente (describe) | Caso de Prueba (it / test) | Preparación (Arrange: props, mocks) | Acción (Act: fireEvent, render) | Resultado Esperado (Assert: expect) | Estado (Pasa / Falla) |
| :--- | :--- | :--- | :--- | :--- | :--- | :--- |
| PU-032 | validarRut | acepta un RUT válido con puntos y guion | RUT `12.345.678-5` | Llamar a `validarRut(rut)` | Devuelve cadena vacía | ✅ |
| PU-033 | validarRut | rechaza un RUT con dígito verificador incorrecto | RUT `12.345.678-9` | Llamar a `validarRut(rut)` | El mensaje contiene `dígito verificador` | ✅ |
| PU-034 | validarRut | rechaza un RUT con formato inválido | RUT `abc` | Llamar a `validarRut(rut)` | El mensaje contiene `formato` | ✅ |
| PU-035 | validarTelefono | acepta un celular chileno con o sin +56 | Teléfonos `+56 9 1234 5678` y `912345678` | Llamar a `validarTelefono` con cada uno | Ambos devuelven cadena vacía | ✅ |
| PU-036 | validarTelefono | rechaza un número que no es celular chileno | Teléfono `12345` | Llamar a `validarTelefono(telefono)` | El mensaje contiene `celular chileno` | ✅ |
| PU-037 | validarRegistro | acepta datos correctos | Datos completos y válidos; lista de usuarios vacía | Llamar a `validarRegistro(datos, [])` | Devuelve `{}` | ✅ |
| PU-038 | validarRegistro | detecta contraseñas que no coinciden | Confirmación `Otra123` distinta de `Clave123` | Llamar a `validarRegistro(datos, [])` | Error `Las contraseñas no coinciden.` | ✅ |
| PU-039 | validarRegistro | exige letras y números en la contraseña | Contraseña `sololetras` | Llamar a `validarRegistro(datos, [])` | El error de `password` contiene `letras y números` | ✅ |
| PU-040 | validarRegistro | detecta correo y RUT ya registrados | Lista con un usuario que tiene el mismo correo y RUT | Llamar a `validarRegistro(datos, existentes)` | Errores `Ya existe una cuenta con ese correo.` y `...con ese RUT.` | ✅ |
| PU-041 | validarRegistro | exige aceptar los términos | Datos válidos con `terminos: false` | Llamar a `validarRegistro(datos, [])` | Existe error en `terminos` | ✅ |
| PU-042 | registrarUsuario | guarda el usuario, formatea el RUT y no devuelve la contraseña | Datos válidos con RUT `98765433`; localStorage limpio | Llamar a `registrarUsuario(datos)` | RUT `9.876.543-3`, sin `password` y 1 usuario guardado | ✅ |
| PU-043 | registrarUsuario | el usuario registrado puede iniciar sesión | Usuario recién registrado | Llamar a `autenticar('JUAN@correo.cl', 'Clave123')` | Devuelve el usuario `Juan Pérez` con rol `cliente` | ✅ |
| PU-044 | formatearRut | agrega puntos y guion | RUT `123456785` sin formato | Llamar a `formatearRut(rut)` | Devuelve `12.345.678-5` | ✅ |

## 6. Carrito de compras: lógica (`src/utils/carrito.test.js`)

| ID | Componente (describe) | Caso de Prueba (it / test) | Preparación (Arrange: props, mocks) | Acción (Act: fireEvent, render) | Resultado Esperado (Assert: expect) | Estado (Pasa / Falla) |
| :--- | :--- | :--- | :--- | :--- | :--- | :--- |
| PU-045 | carrito | guarda y recupera el carrito desde localStorage | Carrito con 2 unidades de `MAT-CEM-001` | Llamar a `guardarCarrito(carrito)` | `obtenerCarrito()` devuelve el mismo carrito | ✅ |
| PU-046 | carrito | devuelve un carrito vacío si no hay nada guardado | localStorage limpio | Llamar a `obtenerCarrito()` | Devuelve `[]` | ✅ |
| PU-047 | carrito | cuenta el total de unidades | Carrito con 2 y 3 unidades de dos productos | Llamar a `contarUnidades(carrito)` | Devuelve 5 | ✅ |
| PU-048 | carrito | quita del carrito los productos que ya no existen | Carrito con un SKU válido y uno inexistente | Llamar a `limpiarCarrito(carrito, productos)` | Solo queda el producto existente | ✅ |
| PU-049 | carrito | calcula el total de las líneas con precio por cantidad | 3 unidades de cemento (precio 4890) | Llamar a `calcularTotalLineas(lineas)` | Devuelve 14670 (4890 × 3) | ✅ |
| PU-050 | carrito | separa neto e IVA de un total con IVA incluido | Total 11900 | Llamar a `desglosarTotal(total)` | Devuelve neto 10000, IVA 1900 y total 11900 | ✅ |

## 7. Checkout: validaciones (`src/utils/checkout.test.js`)

| ID | Componente (describe) | Caso de Prueba (it / test) | Preparación (Arrange: props, mocks) | Acción (Act: fireEvent, render) | Resultado Esperado (Assert: expect) | Estado (Pasa / Falla) |
| :--- | :--- | :--- | :--- | :--- | :--- | :--- |
| PU-051 | validarCheckout | con retiro en tienda no exige región, comuna ni dirección | Datos válidos con `tipoEntrega: 'retiro'` | Llamar a `validarCheckout(datos)` | Devuelve `{}` | ✅ |
| PU-052 | validarCheckout | con despacho exige región, comuna y dirección | Datos válidos con `tipoEntrega: 'despacho'` y sin dirección | Llamar a `validarCheckout(datos)` | Errores en `comuna`, `direccion` y `region` | ✅ |
| PU-053 | validarCheckout | rechaza un RUT inválido y exige método de pago | RUT `12.345.678-9` y método de pago vacío | Llamar a `validarCheckout(datos)` | Hay error en `rut` y el de `metodoPago` es `Selecciona un método de pago.` | ✅ |

## 8. Componentes (`src/components/**`)

| ID | Componente (describe) | Caso de Prueba (it / test) | Preparación (Arrange: props, mocks) | Acción (Act: fireEvent, render) | Resultado Esperado (Assert: expect) | Estado (Pasa / Falla) |
| :--- | :--- | :--- | :--- | :--- | :--- | :--- |
| PU-054 | TarjetaProducto | muestra nombre, SKU y badge de Bajo Stock | Mock del producto `Taladro Percutor 710W Makita` (stock 3, mínimo 5) dentro de `MemoryRouter` | Renderizar `<TarjetaProducto producto={...} />` | Se ven el nombre y `SKU: HER-TAL-042`; el badge `Bajo Stock` tiene las clases `badge` y `stock-low` | ✅ |
| PU-055 | TarjetaProducto | el botón "Ver Detalle" lleva a /catalogo/:id | Mismo mock del producto | Renderizar la tarjeta | El enlace `Ver Detalle` tiene `href="/catalogo/HER-TAL-042"` | ✅ |
| PU-056 | TarjetaProducto (carrito) | el botón "Agregar al carrito" llama a la función con el producto | Función simulada `vi.fn()` como `onAgregarAlCarrito` | Renderizar y hacer clic en `Agregar al carrito` | La función simulada se llama con el producto | ✅ |
| PU-057 | TarjetaProducto (carrito) | con stock 0 el botón está deshabilitado | Producto con `stock: 0` | Renderizar la tarjeta | El botón `Sin stock` está deshabilitado | ✅ |
| PU-058 | FormularioLogin | muestra errores de validación cuando los campos están vacíos | Función simulada `onLoginExitoso` | Renderizar y hacer clic en `Ingresar al Portal` sin datos | Se ven `El correo es obligatorio.` y `La contraseña es obligatoria.`; no se llama a `onLoginExitoso` | ✅ |
| PU-059 | FormularioLogin | muestra un mensaje cuando las credenciales son incorrectas | Correo válido y contraseña incorrecta | Completar el formulario y enviarlo | Alerta `Correo o contraseña incorrectos.`; no hay sesión guardada ni llamada a `onLoginExitoso` | ✅ |
| PU-060 | FormularioLogin | con credenciales correctas guarda la sesión y avisa al padre | `admin@losmaestros.cl` y `Admin123` | Completar el formulario y enviarlo | Se llama a `onLoginExitoso` con rol `admin` y la sesión queda guardada en localStorage | ✅ |
| PU-061 | FormularioProducto | muestra errores y no agrega nada cuando el formulario está vacío | Catálogo inicial y función simulada `onAgregarProducto` | Enviar el formulario vacío | Se ven `El SKU es obligatorio.` y `Selecciona una categoría.`; no se llama a `onAgregarProducto` | ✅ |
| PU-062 | FormularioProducto | agrega el producto, muestra confirmación y limpia el formulario | Datos válidos (SKU `HER-MAR-010`, precio 9990) | Completar y enviar el formulario | Se llama a `onAgregarProducto` con el producto; alerta `agregado al catálogo`; campo SKU vacío | ✅ |
| PU-063 | FormularioProducto | rechaza un SKU repetido | SKU `MAT-CEM-001` que ya existe | Completar y enviar el formulario | Se ve `Ya existe un producto con ese SKU.`; no se llama a `onAgregarProducto` | ✅ |
| PU-064 | FormularioRegistro | muestra errores y no registra cuando el formulario está vacío | Función simulada `onRegistroExitoso` | Hacer clic en `Crear Cuenta` sin datos | Se ven `El RUT es obligatorio.` y `Debes aceptar los términos y condiciones.`; no se llama a `onRegistroExitoso` | ✅ |
| PU-065 | FormularioRegistro | la comuna está deshabilitada hasta elegir una región | Formulario recién renderizado | Elegir la región `coquimbo` | La comuna está deshabilitada antes y habilitada después; aparece la opción `Ovalle` | ✅ |
| PU-066 | FormularioRegistro | con datos válidos registra al usuario, abre la sesión y avisa al padre | Datos válidos (RUT `9.876.543-3`, región Coquimbo, comuna La Serena) | Completar el formulario, aceptar términos y enviar | Se llama a `onRegistroExitoso` con rol `cliente` y la sesión queda guardada | ✅ |
| PU-067 | FormularioCheckout | muestra errores y no confirma cuando el formulario está vacío | Función simulada `onConfirmar`; sin sesión | Hacer clic en `Confirmar Compra` sin datos | Se ven los errores de tipo de entrega y método de pago; no se llama a `onConfirmar` | ✅ |
| PU-068 | FormularioCheckout | muestra los campos de dirección solo con despacho a domicilio | Formulario recién renderizado | Elegir el tipo de entrega `despacho` | El campo `Dirección:` no existe antes y aparece después | ✅ |
| PU-069 | FormularioCheckout | con retiro en tienda y datos válidos llama a onConfirmar | Nombre, RUT y teléfono válidos | Elegir `retiro`, método `transferencia` y enviar | `onConfirmar` se llama con `tipoEntrega: 'retiro'` y `metodoPago: 'transferencia'` | ✅ |
| PU-070 | FormularioCheckout | precarga los datos del usuario con sesión iniciada | Sesión guardada en localStorage con nombre, RUT y teléfono | Renderizar el formulario | Los campos Nombre y RUT muestran los datos de la sesión | ✅ |

## 9. Páginas (`src/pages/*.test.jsx`)

| ID | Componente (describe) | Caso de Prueba (it / test) | Preparación (Arrange: props, mocks) | Acción (Act: fireEvent, render) | Resultado Esperado (Assert: expect) | Estado (Pasa / Falla) |
| :--- | :--- | :--- | :--- | :--- | :--- | :--- |
| PU-071 | Catalogo | muestra todos los productos al inicio | Catálogo inicial (4 productos) dentro de `MemoryRouter` | Renderizar `<Catalogo />` | Se muestran 4 tarjetas de producto | ✅ |
| PU-072 | Catalogo | filtra en vivo al escribir en el buscador | Catálogo renderizado | Escribir `taladro` en el buscador | Queda 1 tarjeta cuyo título contiene `Taladro Percutor` | ✅ |
| PU-073 | Catalogo | muestra un mensaje cuando no hay coincidencias | Catálogo renderizado | Escribir `zzzz` en el buscador | Se ve `No se encontraron productos` | ✅ |
| PU-074 | POS | agrega un producto al detalle de venta y acumula cantidades | POS renderizado; `alert` simulado | Hacer clic dos veces en `+ Agregar` del cemento | El detalle muestra `Saco de Cemento Melón 25kg x 2` | ✅ |
| PU-075 | POS | avisa cuando el producto no tiene stock | POS renderizado; `alert` simulado | Hacer clic en `+ Agregar` del tubo PVC (stock 0) | Se llama a `alert('Producto sin stock disponible')` y el detalle sigue vacío | ✅ |
| PU-076 | POS | no permite superar el stock disponible | POS renderizado; taladro con stock 3 | Hacer clic 4 veces en `+ Agregar` del taladro | Se llama a `alert('No hay suficiente stock disponible')` y el detalle muestra `x 3` | ✅ |
| PU-077 | Carrito | muestra un mensaje cuando el carrito está vacío | Aplicación completa en la ruta `/carrito`; localStorage limpio | Renderizar `<App />` | Se ve `Tu carrito está vacío.` | ✅ |
| PU-078 | Carrito | agregar desde el catálogo actualiza el contador del menú | Aplicación en `/catalogo` | Hacer clic dos veces en `Agregar al carrito` del cemento | El menú muestra el enlace `Carrito (2)` | ✅ |
| PU-079 | Carrito | no permite agregar más unidades que el stock disponible | Aplicación en `/catalogo`; taladro con stock 3; `alert` simulado | Hacer clic 4 veces en `Agregar al carrito` del taladro | Se llama a `alert` con el aviso de stock y el menú muestra `Carrito (3)` | ✅ |
| PU-080 | Carrito | permite aumentar la cantidad de un producto en el carrito | 1 cemento agregado y página `/carrito` abierta | Hacer clic en `Aumentar cantidad` del cemento | El menú muestra `Carrito (2)` | ✅ |
| PU-081 | Carrito | permite quitar un producto y deja el carrito vacío | 1 cemento agregado y página `/carrito` abierta | Hacer clic en `Quitar ... del carrito` | Se ve `Tu carrito está vacío.` | ✅ |
| PU-082 | Carrito | confirmar la compra descuenta el stock y vacía el carrito | 2 cementos en el carrito | Completar el checkout con retiro en tienda y confirmar; volver al catálogo | Aparece `Compra confirmada`, el menú vuelve a `Carrito` y el catálogo muestra `140 unidades` | ✅ |
| PU-083 | Perfil | muestra los datos del usuario con sesión iniciada | Sesión del contratista `Constructora Elqui` | Renderizar la aplicación en `/perfil` | Se ven el nombre, el RUT `12.345.678-5` y `Región de Coquimbo` | ✅ |
| PU-084 | Perfil | sin sesión redirige al login | Sin sesión en localStorage | Renderizar la aplicación en `/perfil` | Se muestra el título `Portal Contratistas` | ✅ |
| PU-085 | Perfil | el menú muestra "Mi Perfil" solo con sesión | Sesión del administrador | Renderizar la aplicación en `/` | El menú contiene el enlace `Mi Perfil` | ✅ |

## 10. Rutas protegidas e integración (`src/routes/RutaPrivada.test.jsx`, `src/App.test.jsx`)

| ID | Componente (describe) | Caso de Prueba (it / test) | Preparación (Arrange: props, mocks) | Acción (Act: fireEvent, render) | Resultado Esperado (Assert: expect) | Estado (Pasa / Falla) |
| :--- | :--- | :--- | :--- | :--- | :--- | :--- |
| PU-086 | RutaPrivada | redirige a /login cuando no hay sesión | Ruta `/admin` protegida; localStorage limpio | Renderizar la ruta `/admin` | Se ve `Pantalla de login` y no el contenido del panel | ✅ |
| PU-087 | RutaPrivada | muestra el contenido cuando la sesión es de administrador | Sesión con rol `admin` | Renderizar la ruta `/admin` | Se ve `Contenido del panel` | ✅ |
| PU-088 | RutaPrivada | redirige al inicio cuando la sesión es de otro rol | Sesión con rol `contratista` | Renderizar la ruta `/admin` | Se ve `Pantalla de inicio` | ✅ |
| PU-089 | App | un producto creado en el panel admin aparece en el catálogo | Sesión de administrador; aplicación en `/admin` | Completar y enviar el formulario de producto; ir a `Catálogo y Stock` | Se ve `Martillo Carpintero 16oz` y hay 5 tarjetas | ✅ |
| PU-090 | App | sin sesión, /admin redirige al login | Sin sesión; aplicación en `/admin` | Renderizar `<App />` | Se muestra el título `Portal Contratistas` | ✅ |

## Verificaciones manuales (no automatizadas)

Estas comprobaciones se hacen en el navegador, porque dependen del aspecto visual:

- **Responsividad:** con las herramientas de desarrollador (F12) en modo móvil, comprobar que el menú, el buscador, el detalle de producto, el POS, los formularios en grilla y el carrito se reorganizan en una sola columna.
- **Fidelidad visual:** comparar cada página con la versión HTML original; `styles.css` se mantiene sin modificaciones.
- **Persistencia:** recargar la página y comprobar que la sesión y el carrito se conservan, mientras que los productos creados desde el panel admin se pierden (comportamiento esperado).

## Resumen

| Módulo | Pruebas |
| :--- | :---: |
| 1. Lógica de inventario | 9 |
| 2. Validaciones de inicio de sesión | 6 |
| 3. Sesión y menú | 9 |
| 4. Productos del panel admin | 7 |
| 5. Registro de usuarios | 13 |
| 6. Carrito de compras: lógica | 6 |
| 7. Checkout: validaciones | 3 |
| 8. Componentes | 17 |
| 9. Páginas | 15 |
| 10. Rutas protegidas e integración | 5 |
| **Total** | **90** |
