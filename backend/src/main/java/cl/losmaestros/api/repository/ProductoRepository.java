package cl.losmaestros.api.repository;

import cl.losmaestros.api.model.Producto;
import org.springframework.data.jpa.repository.JpaRepository;

/** Hereda de JpaRepository: findAll, findById, save, deleteById, existsById... (sin métodos propios). */
public interface ProductoRepository extends JpaRepository<Producto, String> {
}
