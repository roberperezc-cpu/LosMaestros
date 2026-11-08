package cl.losmaestros.api.repository;

import cl.losmaestros.api.model.Venta;
import org.springframework.data.jpa.repository.JpaRepository;

public interface VentaRepository extends JpaRepository<Venta, Long> {
}
