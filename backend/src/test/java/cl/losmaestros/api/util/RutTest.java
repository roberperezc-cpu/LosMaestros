package cl.losmaestros.api.util;

import org.junit.jupiter.api.Test;

import static org.junit.jupiter.api.Assertions.assertEquals;

class RutTest {

    @Test
    void agregaLosPuntosYElGuion() {
        // Arrange
        String rut = "123456785";

        // Act
        String resultado = Rut.normalizar(rut);

        // Assert
        assertEquals("12.345.678-5", resultado);
    }

    @Test
    void unRutYaFormateadoQuedaIgual() {
        // Arrange
        String rut = "9.876.543-3";

        // Act
        String resultado = Rut.normalizar(rut);

        // Assert
        assertEquals("9.876.543-3", resultado);
    }

    @Test
    void ponePuntosEnLaPosicionCorrectaYElDigitoKEnMayuscula() {
        // Arrange
        String rut = " 12345678-k ";

        // Act
        String resultado = Rut.normalizar(rut);

        // Assert
        assertEquals("12.345.678-K", resultado);
    }
}
