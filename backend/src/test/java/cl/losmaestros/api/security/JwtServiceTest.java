package cl.losmaestros.api.security;

import cl.losmaestros.api.model.Usuario;
import cl.losmaestros.api.util.DatosPrueba;
import io.jsonwebtoken.Claims;
import org.junit.jupiter.api.Test;

import static org.junit.jupiter.api.Assertions.assertEquals;
import static org.junit.jupiter.api.Assertions.assertFalse;
import static org.junit.jupiter.api.Assertions.assertTrue;

class JwtServiceTest {

    private static final String SECRETO = "secreto-de-prueba-para-los-tests-de-losmaestros-1234567890";

    @Test
    void elTokenGeneradoEsValidoYLlevaElCorreoYElRol() {
        // Arrange
        JwtService jwtService = new JwtService(SECRETO, 60);
        Usuario usuario = DatosPrueba.usuario("ADMIN", "hash");

        // Act
        String token = jwtService.generarToken(usuario);
        Claims datos = jwtService.extraerDatos(token);

        // Assert
        assertTrue(jwtService.esValido(token));
        assertEquals(usuario.getCorreo(), datos.getSubject());
        assertEquals("ADMIN", datos.get("rol", String.class));
    }

    @Test
    void unTokenModificadoNoEsValido() {
        // Arrange
        JwtService jwtService = new JwtService(SECRETO, 60);
        String token = jwtService.generarToken(DatosPrueba.usuario("USER", "hash"));
        String adulterado = token.substring(0, token.length() - 3) + "abc";

        // Act
        boolean valido = jwtService.esValido(adulterado);

        // Assert
        assertFalse(valido);
    }

    @Test
    void unTokenFirmadoConOtraClaveNoEsValido() {
        // Arrange
        JwtService emisor = new JwtService("otra-clave-distinta-para-firmar-tokens-1234567890-abc", 60);
        JwtService verificador = new JwtService(SECRETO, 60);
        String token = emisor.generarToken(DatosPrueba.usuario("ADMIN", "hash"));

        // Act
        boolean valido = verificador.esValido(token);

        // Assert
        assertFalse(valido);
    }

    @Test
    void unTokenVencidoNoEsValido() {
        // Arrange: expiración negativa = el token nace ya vencido
        JwtService jwtService = new JwtService(SECRETO, -5);
        String token = jwtService.generarToken(DatosPrueba.usuario("USER", "hash"));

        // Act
        boolean valido = jwtService.esValido(token);

        // Assert
        assertFalse(valido);
    }

    @Test
    void unTextoQueNoEsUnTokenNoEsValido() {
        // Arrange
        JwtService jwtService = new JwtService(SECRETO, 60);

        // Act
        boolean valido = jwtService.esValido("esto-no-es-un-jwt");

        // Assert
        assertFalse(valido);
    }
}
