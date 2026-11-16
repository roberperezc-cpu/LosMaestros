package cl.losmaestros.api.dto;

import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotBlank;

public record LoginRequest(
        @NotBlank(message = "El correo es obligatorio.")
        @Email(message = "Ingresa un correo válido (ej: nombre@dominio.cl).")
        String correo,

        @NotBlank(message = "La contraseña es obligatoria.")
        String password
) {
}
