package cl.losmaestros.api.service;

import cl.losmaestros.api.dto.ClienteRequest;
import cl.losmaestros.api.exception.RecursoNoEncontradoException;
import cl.losmaestros.api.model.Cliente;
import cl.losmaestros.api.repository.ClienteRepository;
import cl.losmaestros.api.util.DatosPrueba;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;

import java.util.Optional;

import static org.junit.jupiter.api.Assertions.assertEquals;
import static org.junit.jupiter.api.Assertions.assertThrows;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.verify;
import static org.mockito.Mockito.when;

@ExtendWith(MockitoExtension.class)
class ClienteServiceTest {

    @Mock
    private ClienteRepository repositorio;

    @InjectMocks
    private ClienteService servicio;

    @Test
    void guardarNormalizaElRutYElCorreo() {
        // Arrange
        ClienteRequest base = DatosPrueba.clienteRequest();
        ClienteRequest datos = new ClienteRequest(
                "  12.345.678-k ", base.nombre(), "  PEDRO@Correo.CL ", base.telefono(),
                base.tipoCliente(), base.region(), base.comuna());
        when(repositorio.saveAndFlush(any(Cliente.class))).thenAnswer(llamada -> llamada.getArgument(0));

        // Act
        Cliente guardado = servicio.guardar(datos);

        // Assert
        assertEquals("12.345.678-K", guardado.getRut());
        assertEquals("pedro@correo.cl", guardado.getCorreo());
    }

    @Test
    void buscarPorIdInexistenteLanzaNoEncontrado() {
        // Arrange
        Long id = 999L;
        when(repositorio.findById(id)).thenReturn(Optional.empty());

        // Act + Assert
        assertThrows(RecursoNoEncontradoException.class, () -> servicio.buscarPorId(id));
    }

    @Test
    void actualizarCambiaLosDatosDelCliente() {
        // Arrange
        Cliente existente = DatosPrueba.cliente();
        ClienteRequest nuevosDatos = DatosPrueba.clienteRequest();
        when(repositorio.findById(existente.getId())).thenReturn(Optional.of(existente));
        when(repositorio.saveAndFlush(any(Cliente.class))).thenAnswer(llamada -> llamada.getArgument(0));

        // Act
        Cliente actualizado = servicio.actualizar(existente.getId(), nuevosDatos);

        // Assert
        assertEquals(nuevosDatos.nombre().trim(), actualizado.getNombre());
        assertEquals(nuevosDatos.tipoCliente(), actualizado.getTipoCliente());
    }

    @Test
    void eliminarExistenteLlamaAlRepositorio() {
        // Arrange
        Long id = 7L;
        when(repositorio.existsById(id)).thenReturn(true);

        // Act
        servicio.eliminar(id);

        // Assert
        verify(repositorio).deleteById(id);
    }
}
