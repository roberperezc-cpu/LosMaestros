-- V4 (checkout): una compra con varios productos se guarda como varias filas de "ventas"
-- que comparten el mismo numero_pedido. direccion_entrega solo se llena en los despachos.

ALTER TABLE ventas
    ADD COLUMN numero_pedido      VARCHAR(20)  NULL,
    ADD COLUMN direccion_entrega  VARCHAR(200) NULL;

CREATE INDEX idx_ventas_numero_pedido ON ventas (numero_pedido);
