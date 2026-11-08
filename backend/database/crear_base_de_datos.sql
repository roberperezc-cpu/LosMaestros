-- Ejecutar en MySQL Workbench o en la consola de MySQL.
-- Las tablas (productos, clientes, ventas) las crea Spring Boot solo al arrancar.
CREATE DATABASE IF NOT EXISTS losmaestros
  CHARACTER SET utf8mb4
  COLLATE utf8mb4_unicode_ci;

-- Para comprobar después de arrancar la API:
-- USE losmaestros;
-- SHOW TABLES;
-- SELECT * FROM productos;
-- SELECT * FROM clientes;
-- SELECT * FROM ventas;
