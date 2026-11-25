package cl.losmaestros.api.repository;

import cl.losmaestros.api.model.Cliente;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.Optional;

public interface ClienteRepository extends JpaRepository<Cliente, Long> {

    /** Spring Data genera las consultas a partir del nombre del método. */
    boolean existsByRut(String rut);

    boolean existsByCorreo(String correo);

    Optional<Cliente> findByCorreo(String correo);
}
