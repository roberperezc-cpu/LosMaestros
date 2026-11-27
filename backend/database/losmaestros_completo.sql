-- =====================================================================
--  Ferretería Los Maestros - Script SQL completo (MySQL / MariaDB)
--  Crea la base de datos, las 4 tablas y carga los datos de ejemplo.
--
--  Es equivalente a las migraciones de Flyway (V1 a V4) más los usuarios iniciales.
--  Úsalo si prefieres crear la base a mano en vez de dejar que Flyway lo haga.
--
--  ATENCIÓN: borra las tablas productos, clientes, ventas y usuarios si ya existen.
--
--  Cómo ejecutarlo: phpMyAdmin -> pestaña "SQL" -> pegar todo -> Continuar
--                   (o MySQL Workbench / consola: mysql -u root < losmaestros_completo.sql)
--
--  Después se puede arrancar el backend normalmente: Flyway detecta que la base ya existe
--  y la toma como versión 4 (spring.flyway.baseline-on-migrate) sin repetir las migraciones.
-- =====================================================================

DROP DATABASE IF EXISTS losmaestros;
CREATE DATABASE losmaestros CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
USE losmaestros;
SET NAMES utf8mb4;


-- ---------- Tablas (V1) ----------
CREATE TABLE productos (
    id               VARCHAR(20)   NOT NULL,
    nombre           VARCHAR(120)  NOT NULL,
    categoria        VARCHAR(40)   NOT NULL,
    categoria_nombre VARCHAR(60)   NOT NULL,
    precio           INT           NOT NULL,
    stock            INT           NOT NULL,
    stock_minimo     INT           NOT NULL,
    ubicacion        VARCHAR(80)   NOT NULL,
    imagen           VARCHAR(255),
    especificaciones VARCHAR(1000),
    PRIMARY KEY (id)
) ENGINE = InnoDB DEFAULT CHARSET = utf8mb4 COLLATE = utf8mb4_unicode_ci;

CREATE TABLE clientes (
    id           BIGINT       NOT NULL AUTO_INCREMENT,
    rut          VARCHAR(12)  NOT NULL,
    nombre       VARCHAR(120) NOT NULL,
    correo       VARCHAR(120) NOT NULL,
    telefono     VARCHAR(20)  NOT NULL,
    tipo_cliente VARCHAR(20)  NOT NULL,
    region       VARCHAR(40)  NOT NULL,
    comuna       VARCHAR(60)  NOT NULL,
    PRIMARY KEY (id),
    CONSTRAINT uk_clientes_rut UNIQUE (rut),
    CONSTRAINT uk_clientes_correo UNIQUE (correo)
) ENGINE = InnoDB DEFAULT CHARSET = utf8mb4 COLLATE = utf8mb4_unicode_ci;

CREATE TABLE ventas (
    id              BIGINT      NOT NULL AUTO_INCREMENT,
    fecha           DATETIME(6) NOT NULL,
    cliente_id      BIGINT      NOT NULL,
    producto_id     VARCHAR(20) NOT NULL,
    cantidad        INT         NOT NULL,
    precio_unitario INT         NOT NULL,
    total           INT         NOT NULL,
    tipo_entrega    VARCHAR(20) NOT NULL,
    metodo_pago     VARCHAR(20) NOT NULL,
    PRIMARY KEY (id)
) ENGINE = InnoDB DEFAULT CHARSET = utf8mb4 COLLATE = utf8mb4_unicode_ci;

-- ---------- Usuarios (V3) ----------
CREATE TABLE usuarios (
    id       BIGINT       NOT NULL AUTO_INCREMENT,
    nombre   VARCHAR(120) NOT NULL,
    correo   VARCHAR(120) NOT NULL,
    password VARCHAR(100) NOT NULL,
    rol      VARCHAR(20)  NOT NULL,
    PRIMARY KEY (id),
    CONSTRAINT uk_usuarios_correo UNIQUE (correo)
) ENGINE = InnoDB DEFAULT CHARSET = utf8mb4 COLLATE = utf8mb4_unicode_ci;

-- ---------- Checkout: columnas de pedidos en ventas (V4) ----------
ALTER TABLE ventas
    ADD COLUMN numero_pedido      VARCHAR(20)  NULL,
    ADD COLUMN direccion_entrega  VARCHAR(200) NULL;

CREATE INDEX idx_ventas_numero_pedido ON ventas (numero_pedido);

-- ---------- Datos de ejemplo (V2) ----------
INSERT INTO productos (id, nombre, categoria, categoria_nombre, precio, stock, stock_minimo, ubicacion, imagen, especificaciones) VALUES
('MAT-CEM-001', 'Saco de Cemento Melón 25kg', 'construccion', 'Construcción', 4890, 142, 20, 'Bodega Patio - Sector A', 'Cemento1.jpg',
 '{"Marca":"Melón","Peso":"25 kg","Uso":"Estructuras, pavimentos y albañilería general","Rendimiento":"Según dosificación de mezcla"}'),
('HER-TAL-042', 'Taladro Percutor 710W Makita', 'herramientas-elec', 'Herramientas Eléctricas', 58990, 3, 5, 'Pasillo A - Estante 4', 'taladro.jpg',
 '{"Marca":"Makita","Potencia":"710W","Velocidad":"0 - 3.200 RPM","Capacidad Hormigón":"16 mm","Garantía":"12 meses oficial"}'),
('GAS-PVC-110', 'Tubo PVC Sanitario 110mm x 3m', 'gasfiteria', 'Gasfitería', 8490, 0, 10, 'Bodega Exterior - Estante C', 'tubo.jpg',
 '{"Diámetro":"110 mm","Largo":"3 metros","Material":"PVC Rígido Sanitario","Norma":"NCh397"}'),
('ELE-CAB-002', 'Cable Eléctrico 2.5mm Flex (Rollo 100m)', 'electricidad', 'Electricidad', 32990, 18, 8, 'Pasillo B - Estante 2', 'cable.jpg',
 '{"Sección":"2.5 mm²","Largo":"100 metros","Aislamiento":"PVC 70°C","Uso":"Instalaciones domiciliarias e industriales"}');

INSERT INTO clientes (rut, nombre, correo, telefono, tipo_cliente, region, comuna) VALUES
('12.345.678-5', 'Constructora Elqui', 'contratista@losmaestros.cl', '+56 9 8765 4321', 'contratista', 'coquimbo', 'Coquimbo'),
('9.876.543-3', 'Juan Pérez', 'juan@correo.cl', '+56 9 1234 5678', 'particular', 'coquimbo', 'La Serena');

-- ---------- Usuarios iniciales ----------
-- Las contraseñas están cifradas con BCrypt (nunca se guardan en texto plano):
--   admin@losmaestros.cl       -> Admin123   (rol ADMIN)
--   contratista@losmaestros.cl -> Maestro123 (rol USER)
INSERT INTO usuarios (nombre, correo, password, rol) VALUES
('Administrador', 'admin@losmaestros.cl', '$2a$10$M29KWH090qBdBROc8dvhwefvbGncUOr4Galrsb4YkrDfhH8goSxeq', 'ADMIN'),
('Constructora Elqui', 'contratista@losmaestros.cl', '$2a$10$C7o4aE6PAJDopCZSSxuunO7SVGS4FlsuPAAVgz7eAyqwEjAqhR..C', 'USER');

