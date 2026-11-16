package cl.losmaestros.api.service;

import cl.losmaestros.api.dto.AuthResponse;
import cl.losmaestros.api.dto.LoginRequest;
import cl.losmaestros.api.dto.RegistroRequest;
import cl.losmaestros.api.exception.ConflictoException;
import cl.losmaestros.api.exception.CredencialesInvalidasException;
import cl.losmaestros.api.model.Usuario;
import cl.losmaestros.api.repository.UsuarioRepository;
import cl.losmaestros.api.security.JwtService;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

/** Inicio de sesión y registro de usuarios. */
@Service
public class AuthService {

    private final UsuarioRepository repositorio;
    private final PasswordEncoder codificador;
    private final JwtService jwtService;

    public AuthService(UsuarioRepository repositorio, PasswordEncoder codificador, JwtService jwtService) {
        this.repositorio = repositorio;
        this.codificador = codificador;
        this.jwtService = jwtService;
    }

    /** Si el correo no existe o la contraseña no coincide, da el mismo error (no revela cuál falló). */
    public AuthResponse login(LoginRequest datos) {
        Usuario usuario = repositorio.findByCorreo(normalizar(datos.correo()))
                .filter(u -> codificador.matches(datos.password(), u.getPassword()))
                .orElseThrow(() -> new CredencialesInvalidasException("Correo o contraseña incorrectos."));

        return respuesta(usuario);
    }

    @Transactional
    public AuthResponse registrar(RegistroRequest datos) {
        String correo = normalizar(datos.correo());
        if (repositorio.existsByCorreo(correo)) {
            throw new ConflictoException("Ya existe una cuenta con ese correo.");
        }

        Usuario usuario = new Usuario();
        usuario.setNombre(datos.nombre().trim());
        usuario.setCorreo(correo);
        usuario.setPassword(codificador.encode(datos.password())); // se guarda el hash, no la contraseña
        usuario.setRol("USER");

        return respuesta(repositorio.save(usuario));
    }

    private String normalizar(String correo) {
        return correo.trim().toLowerCase();
    }

    private AuthResponse respuesta(Usuario usuario) {
        return new AuthResponse(
                jwtService.generarToken(usuario),
                "Bearer",
                jwtService.getExpiracionMinutos(),
                new AuthResponse.UsuarioInfo(usuario.getId(), usuario.getNombre(), usuario.getCorreo(), usuario.getRol()));
    }
}
