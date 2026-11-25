package cl.losmaestros.api.dto;

/**
 * Respuesta de login y registro: el token JWT, los datos del usuario y, si tiene ficha de cliente,
 * sus datos de perfil (el administrador no tiene: "cliente" viene null).
 */
public record AuthResponse(String token, String tipo, long expiraEnMinutos, UsuarioInfo usuario, ClienteInfo cliente) {

    public record UsuarioInfo(Long id, String nombre, String correo, String rol) {
    }

    public record ClienteInfo(String rut, String telefono, String tipoCliente, String region, String comuna) {
    }
}
