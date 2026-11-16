package cl.losmaestros.api.repository;

import cl.losmaestros.api.model.Usuario;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.Optional;

public interface UsuarioRepository extends JpaRepository<Usuario, Long> {

    /** Spring Data genera la consulta a partir del nombre del método. */
    Optional<Usuario> findByCorreo(String correo);

    boolean existsByCorreo(String correo);
}
