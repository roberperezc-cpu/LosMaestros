package cl.losmaestros.api.dto;

import java.time.LocalDateTime;
import java.util.List;

/** Comprobante de la compra confirmada. */
public record PedidoResponse(
        String numeroPedido,
        LocalDateTime fecha,
        int total,
        String tipoEntrega,
        String metodoPago,
        String direccionEntrega,
        List<Linea> lineas
) {

    public record Linea(String productoId, String nombre, int cantidad, int precioUnitario, int subtotal) {
    }
}
