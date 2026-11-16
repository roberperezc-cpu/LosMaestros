package cl.losmaestros.api.dto;

/** Respuesta de login y registro: el token JWT y los datos públicos del usuario. */
public record AuthResponse(String token, String tipo, long expiraEnMinutos, UsuarioInfo usuario) {

    public record UsuarioInfo(Long id, String nombre, String correo, String rol) {
    }
}
