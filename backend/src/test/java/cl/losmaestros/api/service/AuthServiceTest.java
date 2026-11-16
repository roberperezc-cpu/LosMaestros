package cl.losmaestros.api.service;

import cl.losmaestros.api.dto.AuthResponse;
import cl.losmaestros.api.dto.LoginRequest;
import cl.losmaestros.api.dto.RegistroRequest;
import cl.losmaestros.api.exception.ConflictoException;
import cl.losmaestros.api.exception.CredencialesInvalidasException;
import cl.losmaestros.api.model.Usuario;
import cl.losmaestros.api.repository.UsuarioRepository;
import cl.losmaestros.api.security.JwtService;
import cl.losmaestros.api.util.DatosPrueba;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.ArgumentCaptor;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.security.crypto.password.PasswordEncoder;

import java.util.Optional;

import static org.junit.jupiter.api.Assertions.assertEquals;
import static org.junit.jupiter.api.Assertions.assertNotEquals;
import static org.junit.jupiter.api.Assertions.assertThrows;
import static org.junit.jupiter.api.Assertions.assertTrue;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.never;
import static org.mockito.Mockito.verify;
import static org.mockito.Mockito.when;

@ExtendWith(MockitoExtension.class)
class AuthServiceTest {

    private static final String SECRETO = "secreto-de-prueba-para-los-tests-de-losmaestros-1234567890";

    @Mock
    private UsuarioRepository repositorio;

    private final PasswordEncoder codificador = new BCryptPasswordEncoder();
    private JwtService jwtService;
    private AuthService servicio;

    @BeforeEach
    void preparar() {
        jwtService = new JwtService(SECRETO, 60);
        servicio = new AuthService(repositorio, codificador, jwtService);
    }

    @Test
    void loginConCredencialesCorrectasDevuelveUnTokenValido() {
        // Arrange
        Usuario usuario = DatosPrueba.usuario("ADMIN", codificador.encode("Clave123"));
        when(repositorio.findByCorreo(usuario.getCorreo())).thenReturn(Optional.of(usuario));

        // Act
        AuthResponse respuesta = servicio.login(new LoginRequest(usuario.getCorreo(), "Clave123"));

        // Assert
        assertTrue(jwtService.esValido(respuesta.token()));
        assertEquals("Bearer", respuesta.tipo());
        assertEquals("ADMIN", respuesta.usuario().rol());
    }

    @Test
    void loginConPasswordIncorrectoLanzaCredencialesInvalidas() {
        // Arrange
        Usuario usuario = DatosPrueba.usuario("USER", codificador.encode("Clave123"));
        when(repositorio.findByCorreo(usuario.getCorreo())).thenReturn(Optional.of(usuario));

        // Act + Assert
        assertThrows(CredencialesInvalidasException.class,
                () -> servicio.login(new LoginRequest(usuario.getCorreo(), "OtraClave9")));
    }

    @Test
    void loginConCorreoInexistenteLanzaCredencialesInvalidas() {
        // Arrange
        String correo = DatosPrueba.correo();
        when(repositorio.findByCorreo(correo)).thenReturn(Optional.empty());

        // Act + Assert
        assertThrows(CredencialesInvalidasException.class,
                () -> servicio.login(new LoginRequest(correo, "Clave123")));
    }

    @Test
    void registrarConCorreoRepetidoLanzaConflicto() {
        // Arrange
        String correo = DatosPrueba.correo();
        when(repositorio.existsByCorreo(correo)).thenReturn(true);

        // Act + Assert
        assertThrows(ConflictoException.class,
                () -> servicio.registrar(new RegistroRequest("Nombre Prueba", correo, "Clave123")));
        verify(repositorio, never()).save(any(Usuario.class));
    }

    @Test
    void registrarGuardaLaPasswordCifradaYConRolUser() {
        // Arrange
        String correo = DatosPrueba.correo();
        when(repositorio.existsByCorreo(correo)).thenReturn(false);
        when(repositorio.save(any(Usuario.class))).thenAnswer(llamada -> llamada.getArgument(0));

        // Act
        servicio.registrar(new RegistroRequest("Nombre Prueba", correo, "Clave123"));

        // Assert
        ArgumentCaptor<Usuario> captor = ArgumentCaptor.forClass(Usuario.class);
        verify(repositorio).save(captor.capture());
        Usuario guardado = captor.getValue();
        assertNotEquals("Clave123", guardado.getPassword());
        assertTrue(codificador.matches("Clave123", guardado.getPassword()));
        assertEquals("USER", guardado.getRol());
    }
}
