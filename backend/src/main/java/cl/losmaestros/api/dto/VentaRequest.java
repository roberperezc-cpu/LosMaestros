package cl.losmaestros.api.dto;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Pattern;
import jakarta.validation.constraints.Positive;

/** Datos que llegan para crear o actualizar una venta. La fecha y el total los calcula el servidor. */
public record VentaRequest(
        @NotNull(message = "El id del cliente es obligatorio.")
        @Positive(message = "El id del cliente debe ser mayor a 0.")
        Long clienteId,

        @NotBlank(message = "El SKU del producto es obligatorio.")
        String productoId,

        @NotNull(message = "La cantidad es obligatoria.")
        @Positive(message = "La cantidad debe ser mayor a 0.")
        Integer cantidad,

        @NotNull(message = "El precio unitario es obligatorio.")
        @Positive(message = "El precio unitario debe ser mayor a 0.")
        Integer precioUnitario,

        @NotBlank(message = "El tipo de entrega es obligatorio.")
        @Pattern(regexp = "^(retiro|despacho)$", message = "El tipo de entrega debe ser retiro o despacho.")
        String tipoEntrega,

        @NotBlank(message = "El método de pago es obligatorio.")
        @Pattern(regexp = "^(transferencia|tarjeta|efectivo)$", message = "El método de pago debe ser transferencia, tarjeta o efectivo.")
        String metodoPago
) {
}
