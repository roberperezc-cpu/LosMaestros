-- ATENCIÓN: borra la base "losmaestros" completa y la deja vacía.
-- Ejecutar UNA vez al pasar al Sprint 2: Flyway necesita partir de una base vacía
-- para crear las tablas con sus migraciones (V1, V2, V3).
-- Después, al arrancar la API, Flyway crea todo y carga los datos de ejemplo.
DROP DATABASE IF EXISTS losmaestros;

CREATE DATABASE losmaestros
  CHARACTER SET utf8mb4
  COLLATE utf8mb4_unicode_ci;

-- Para comprobar después de arrancar la API:
-- USE losmaestros;
-- SHOW TABLES;                       -- productos, clientes, ventas, usuarios y flyway_schema_history
-- SELECT * FROM flyway_schema_history;  -- las 3 migraciones aplicadas (V1, V2, V3)
-- SELECT id, correo, rol, password FROM usuarios;  -- las contraseñas aparecen cifradas ($2a$...)
