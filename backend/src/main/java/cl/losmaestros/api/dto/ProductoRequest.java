package cl.losmaestros.api.dto;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Pattern;
import jakarta.validation.constraints.Positive;
import jakarta.validation.constraints.PositiveOrZero;
import jakarta.validation.constraints.Size;

/** Datos que llegan para crear o actualizar un producto, con sus validaciones. */
public record ProductoRequest(
        @NotBlank(message = "El SKU es obligatorio.")
        @Pattern(regexp = "^[A-Z]{3}-[A-Z]{3}-\\d{3}$", message = "Formato inválido. Usa AAA-AAA-000 (ej: HER-MAR-010).")
        String id,

        @NotBlank(message = "El nombre es obligatorio.")
        @Size(min = 3, max = 120, message = "El nombre debe tener entre 3 y 120 caracteres.")
        String nombre,

        @NotBlank(message = "La categoría es obligatoria.")
        String categoria,

        @NotBlank(message = "El nombre de la categoría es obligatorio.")
        String categoriaNombre,

        @NotNull(message = "El precio es obligatorio.")
        @Positive(message = "El precio debe ser mayor a 0.")
        Integer precio,

        @NotNull(message = "El stock es obligatorio.")
        @PositiveOrZero(message = "El stock no puede ser negativo.")
        Integer stock,

        @NotNull(message = "El stock mínimo es obligatorio.")
        @PositiveOrZero(message = "El stock mínimo no puede ser negativo.")
        Integer stockMinimo,

        @NotBlank(message = "La ubicación en bodega es obligatoria.")
        String ubicacion,

        String imagen,

        @Size(max = 1000, message = "Las especificaciones no pueden superar 1000 caracteres.")
        String especificaciones
) {
}
