package cl.losmaestros.api.service;

import cl.losmaestros.api.dto.ProductoRequest;
import cl.losmaestros.api.exception.ConflictoException;
import cl.losmaestros.api.exception.RecursoNoEncontradoException;
import cl.losmaestros.api.model.Producto;
import cl.losmaestros.api.repository.ProductoRepository;
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
import static org.mockito.Mockito.never;
import static org.mockito.Mockito.verify;
import static org.mockito.Mockito.when;

@ExtendWith(MockitoExtension.class)
class ProductoServiceTest {

    @Mock
    private ProductoRepository repositorio;

    @InjectMocks
    private ProductoService servicio;

    @Test
    void guardarCreaElProductoCuandoElSkuNoExiste() {
        // Arrange
        ProductoRequest datos = DatosPrueba.productoRequest();
        when(repositorio.existsById(datos.id())).thenReturn(false);
        when(repositorio.save(any(Producto.class))).thenAnswer(llamada -> llamada.getArgument(0));

        // Act
        Producto guardado = servicio.guardar(datos);

        // Assert
        assertEquals(datos.id(), guardado.getId());
        assertEquals(datos.precio(), guardado.getPrecio());
        assertEquals(datos.stock(), guardado.getStock());
    }

    @Test
    void guardarConSkuRepetidoLanzaConflicto() {
        // Arrange
        ProductoRequest datos = DatosPrueba.productoRequest();
        when(repositorio.existsById(datos.id())).thenReturn(true);

        // Act + Assert
        assertThrows(ConflictoException.class, () -> servicio.guardar(datos));
        verify(repositorio, never()).save(any(Producto.class));
    }

    @Test
    void buscarPorIdInexistenteLanzaNoEncontrado() {
        // Arrange
        String sku = DatosPrueba.sku();
        when(repositorio.findById(sku)).thenReturn(Optional.empty());

        // Act + Assert
        assertThrows(RecursoNoEncontradoException.class, () -> servicio.buscarPorId(sku));
    }

    @Test
    void actualizarCambiaLosDatosPeroConservaElSku() {
        // Arrange
        Producto existente = DatosPrueba.producto();
        ProductoRequest nuevosDatos = DatosPrueba.productoRequest();
        when(repositorio.findById(existente.getId())).thenReturn(Optional.of(existente));
        when(repositorio.save(any(Producto.class))).thenAnswer(llamada -> llamada.getArgument(0));
        String skuOriginal = existente.getId();

        // Act
        Producto actualizado = servicio.actualizar(skuOriginal, nuevosDatos);

        // Assert
        assertEquals(skuOriginal, actualizado.getId());
        assertEquals(nuevosDatos.nombre().trim(), actualizado.getNombre());
        assertEquals(nuevosDatos.precio(), actualizado.getPrecio());
    }

    @Test
    void eliminarInexistenteLanzaNoEncontrado() {
        // Arrange
        String sku = DatosPrueba.sku();
        when(repositorio.existsById(sku)).thenReturn(false);

        // Act + Assert
        assertThrows(RecursoNoEncontradoException.class, () -> servicio.eliminar(sku));
        verify(repositorio, never()).deleteById(any(String.class));
    }

    @Test
    void eliminarExistenteLlamaAlRepositorio() {
        // Arrange
        String sku = DatosPrueba.sku();
        when(repositorio.existsById(sku)).thenReturn(true);

        // Act
        servicio.eliminar(sku);

        // Assert
        verify(repositorio).deleteById(sku);
    }
}
