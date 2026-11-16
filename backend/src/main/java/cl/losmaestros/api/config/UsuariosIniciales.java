package cl.losmaestros.api.config;

import cl.losmaestros.api.model.Usuario;
import cl.losmaestros.api.repository.UsuarioRepository;
import org.springframework.boot.CommandLineRunner;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.security.crypto.password.PasswordEncoder;

/**
 * Los productos y clientes iniciales los carga Flyway (migración V2).
 * Los usuarios se crean aquí porque su contraseña debe cifrarse con BCrypt al guardarla.
 */
@Configuration
public class UsuariosIniciales {

    @Bean
    CommandLineRunner cargarUsuariosIniciales(UsuarioRepository usuarios, PasswordEncoder codificador) {
        return args -> {
            if (usuarios.count() > 0) {
                return;
            }
            usuarios.save(usuario("Administrador", "admin@losmaestros.cl", "Admin123", "ADMIN", codificador));
            usuarios.save(usuario("Constructora Elqui", "contratista@losmaestros.cl", "Maestro123", "USER", codificador));
        };
    }

    private static Usuario usuario(String nombre, String correo, String password, String rol, PasswordEncoder codificador) {
        Usuario u = new Usuario();
        u.setNombre(nombre);
        u.setCorreo(correo);
        u.setPassword(codificador.encode(password));
        u.setRol(rol);
        return u;
    }
}
