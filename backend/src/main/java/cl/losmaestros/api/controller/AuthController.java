package cl.losmaestros.api.controller;

import cl.losmaestros.api.dto.AuthResponse;
import cl.losmaestros.api.dto.LoginRequest;
import cl.losmaestros.api.dto.RegistroRequest;
import cl.losmaestros.api.service.AuthService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.responses.ApiResponse;
import io.swagger.v3.oas.annotations.security.SecurityRequirements;
import io.swagger.v3.oas.annotations.tags.Tag;
import jakarta.validation.Valid;
import org.springframework.http.HttpStatus;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.ResponseStatus;
import org.springframework.web.bind.annotation.RestController;

/** Endpoints públicos de autenticación: /api/auth */
@RestController
@RequestMapping("/api/auth")
@Tag(name = "Autenticación", description = "Inicio de sesión y registro. Devuelven un token JWT para usar en las demás peticiones.")
@SecurityRequirements // estos endpoints no necesitan token
public class AuthController {

    private final AuthService servicio;

    public AuthController(AuthService servicio) {
        this.servicio = servicio;
    }

    @PostMapping("/login")
    @Operation(summary = "Iniciar sesión", description = "Valida correo y contraseña y devuelve un token JWT.")
    @ApiResponse(responseCode = "200", description = "Sesión iniciada; incluye el token")
    @ApiResponse(responseCode = "400", description = "Datos inválidos")
    @ApiResponse(responseCode = "401", description = "Correo o contraseña incorrectos")
    public AuthResponse login(@Valid @RequestBody LoginRequest datos) {
        return servicio.login(datos);
    }

    @PostMapping("/registro")
    @ResponseStatus(HttpStatus.CREATED)
    @Operation(summary = "Registrar usuario", description = "Crea la cuenta (rol USER, contraseña cifrada) y la ficha del cliente en MySQL, y devuelve su token JWT.")
    @ApiResponse(responseCode = "201", description = "Cuenta creada")
    @ApiResponse(responseCode = "400", description = "Datos inválidos")
    @ApiResponse(responseCode = "409", description = "El correo o el RUT ya están registrados")
    public AuthResponse registro(@Valid @RequestBody RegistroRequest datos) {
        return servicio.registrar(datos);
    }
}
