package cl.losmaestros.api.dto;

import jakarta.validation.Valid;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotEmpty;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Pattern;
import jakarta.validation.constraints.Positive;
import jakarta.validation.constraints.Size;

import java.util.List;

/**
 * Compra que envía el carrito. Solo lleva el SKU y la cantidad de cada producto:
 * el precio lo toma el servidor de la base de datos (nunca se confía en el precio del cliente).
 */
public record PedidoRequest(
        @NotBlank(message = "El tipo de entrega es obligatorio.")
        @Pattern(regexp = "^(retiro|despacho)$", message = "El tipo de entrega debe ser retiro o despacho.")
        String tipoEntrega,

        @NotBlank(message = "El método de pago es obligatorio.")
        @Pattern(regexp = "^(transferencia|tarjeta|efectivo)$", message = "El método de pago debe ser transferencia, tarjeta o efectivo.")
        String metodoPago,

        @Size(max = 200, message = "La dirección no puede superar 200 caracteres.")
        String direccionEntrega,

        @NotEmpty(message = "El pedido debe tener al menos un producto.")
        @Valid
        List<ItemPedido> items
) {

    public record ItemPedido(
            @NotBlank(message = "El SKU del producto es obligatorio.")
            String productoId,

            @NotNull(message = "La cantidad es obligatoria.")
            @Positive(message = "La cantidad debe ser mayor a 0.")
            Integer cantidad
    ) {
    }
}
