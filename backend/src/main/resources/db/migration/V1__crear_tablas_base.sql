-- V1: tablas del Sprint 1 (productos, clientes y ventas). Entidades independientes: sin claves foráneas.

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
