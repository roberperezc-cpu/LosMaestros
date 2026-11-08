package cl.losmaestros.api.dto;

import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Pattern;
import jakarta.validation.constraints.Size;

/** Datos que llegan para crear o actualizar un cliente. */
public record ClienteRequest(
        @NotBlank(message = "El RUT es obligatorio.")
        @Pattern(regexp = "^\\d{1,2}\\.?\\d{3}\\.?\\d{3}-[\\dkK]$", message = "Formato de RUT inválido (ej: 12.345.678-5).")
        String rut,

        @NotBlank(message = "El nombre es obligatorio.")
        @Size(min = 3, max = 120, message = "El nombre debe tener entre 3 y 120 caracteres.")
        String nombre,

        @NotBlank(message = "El correo es obligatorio.")
        @Email(message = "Ingresa un correo válido (ej: nombre@dominio.cl).")
        String correo,

        @NotBlank(message = "El teléfono es obligatorio.")
        @Pattern(regexp = "^(\\+?56\\s?)?9\\s?\\d{4}\\s?\\d{4}$", message = "Ingresa un celular chileno válido (ej: +56 9 1234 5678).")
        String telefono,

        @NotBlank(message = "El tipo de cliente es obligatorio.")
        @Pattern(regexp = "^(particular|contratista|empresa)$", message = "El tipo de cliente debe ser particular, contratista o empresa.")
        String tipoCliente,

        @NotBlank(message = "La región es obligatoria.")
        String region,

        @NotBlank(message = "La comuna es obligatoria.")
        String comuna
) {
}
