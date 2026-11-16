package cl.losmaestros.api.service;

import cl.losmaestros.api.dto.VentaRequest;
import cl.losmaestros.api.exception.RecursoNoEncontradoException;
import cl.losmaestros.api.model.Venta;
import cl.losmaestros.api.repository.VentaRepository;
import cl.losmaestros.api.util.DatosPrueba;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;

import java.time.LocalDateTime;
import java.util.Optional;

import static org.junit.jupiter.api.Assertions.assertEquals;
import static org.junit.jupiter.api.Assertions.assertNotNull;
import static org.junit.jupiter.api.Assertions.assertThrows;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.when;

@ExtendWith(MockitoExtension.class)
class VentaServiceTest {

    @Mock
    private VentaRepository repositorio;

    @InjectMocks
    private VentaService servicio;

    @Test
    void guardarPoneLaFechaYCalculaElTotal() {
        // Arrange
        VentaRequest datos = DatosPrueba.ventaRequest();
        when(repositorio.save(any(Venta.class))).thenAnswer(llamada -> llamada.getArgument(0));

        // Act
        Venta guardada = servicio.guardar(datos);

        // Assert
        assertNotNull(guardada.getFecha());
        assertEquals(datos.cantidad() * datos.precioUnitario(), guardada.getTotal());
    }

    @Test
    void actualizarRecalculaElTotalYConservaLaFecha() {
        // Arrange
        LocalDateTime fechaOriginal = LocalDateTime.of(2026, 11, 9, 10, 30);
        Venta existente = new Venta();
        existente.setId(1L);
        existente.setFecha(fechaOriginal);
        VentaRequest nuevosDatos = DatosPrueba.ventaRequest();
        when(repositorio.findById(1L)).thenReturn(Optional.of(existente));
        when(repositorio.save(any(Venta.class))).thenAnswer(llamada -> llamada.getArgument(0));

        // Act
        Venta actualizada = servicio.actualizar(1L, nuevosDatos);

        // Assert
        assertEquals(fechaOriginal, actualizada.getFecha());
        assertEquals(nuevosDatos.cantidad() * nuevosDatos.precioUnitario(), actualizada.getTotal());
    }

    @Test
    void buscarPorIdInexistenteLanzaNoEncontrado() {
        // Arrange
        when(repositorio.findById(404L)).thenReturn(Optional.empty());

        // Act + Assert
        assertThrows(RecursoNoEncontradoException.class, () -> servicio.buscarPorId(404L));
    }
}
