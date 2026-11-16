-- V3 (Sprint 2): tabla de usuarios para el inicio de sesión con JWT.
-- La contraseña se guarda cifrada con BCrypt (nunca en texto plano).
-- Los usuarios iniciales los crea la aplicación al arrancar (ver config/UsuariosIniciales.java).

CREATE TABLE usuarios (
    id       BIGINT       NOT NULL AUTO_INCREMENT,
    nombre   VARCHAR(120) NOT NULL,
    correo   VARCHAR(120) NOT NULL,
    password VARCHAR(100) NOT NULL,
    rol      VARCHAR(20)  NOT NULL,
    PRIMARY KEY (id),
    CONSTRAINT uk_usuarios_correo UNIQUE (correo)
) ENGINE = InnoDB DEFAULT CHARSET = utf8mb4 COLLATE = utf8mb4_unicode_ci;
