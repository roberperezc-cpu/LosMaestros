package cl.losmaestros.api.service;

import cl.losmaestros.api.dto.AuthResponse;
import cl.losmaestros.api.dto.LoginRequest;
import cl.losmaestros.api.dto.RegistroRequest;
import cl.losmaestros.api.exception.ConflictoException;
import cl.losmaestros.api.exception.CredencialesInvalidasException;
import cl.losmaestros.api.model.Cliente;
import cl.losmaestros.api.model.Usuario;
import cl.losmaestros.api.repository.ClienteRepository;
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
import static org.junit.jupiter.api.Assertions.assertNotNull;
import static org.junit.jupiter.api.Assertions.assertNull;
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
    private UsuarioRepository usuarios;

    @Mock
    private ClienteRepository clientes;

    private final PasswordEncoder codificador = new BCryptPasswordEncoder();
    private JwtService jwtService;
    private AuthService servicio;

    @BeforeEach
    void preparar() {
        jwtService = new JwtService(SECRETO, 60);
        servicio = new AuthService(usuarios, clientes, codificador, jwtService);
    }

    // ---------- login ----------

    @Test
    void loginConCredencialesCorrectasDevuelveUnTokenValido() {
        // Arrange
        Usuario usuario = DatosPrueba.usuario("ADMIN", codificador.encode("Clave123"));
        when(usuarios.findByCorreo(usuario.getCorreo())).thenReturn(Optional.of(usuario));

        // Act
        AuthResponse respuesta = servicio.login(new LoginRequest(usuario.getCorreo(), "Clave123"));

        // Assert
        assertTrue(jwtService.esValido(respuesta.token()));
        assertEquals("Bearer", respuesta.tipo());
        assertEquals("ADMIN", respuesta.usuario().rol());
    }

    @Test
    void loginDeUnUsuarioSinFichaDeClienteDevuelveElPerfilNulo() {
        // Arrange
        Usuario admin = DatosPrueba.usuario("ADMIN", codificador.encode("Clave123"));
        when(usuarios.findByCorreo(admin.getCorreo())).thenReturn(Optional.of(admin));

        // Act
        AuthResponse respuesta = servicio.login(new LoginRequest(admin.getCorreo(), "Clave123"));

        // Assert
        assertNull(respuesta.cliente());
    }

    @Test
    void loginDeUnClienteDevuelveSuPerfil() {
        // Arrange
        Cliente cliente = DatosPrueba.cliente();
        Usuario usuario = DatosPrueba.usuario("USER", codificador.encode("Clave123"));
        usuario.setCorreo(cliente.getCorreo());
        when(usuarios.findByCorreo(usuario.getCorreo())).thenReturn(Optional.of(usuario));
        when(clientes.findByCorreo(usuario.getCorreo())).thenReturn(Optional.of(cliente));

        // Act
        AuthResponse respuesta = servicio.login(new LoginRequest(usuario.getCorreo(), "Clave123"));

        // Assert
        assertEquals(cliente.getRut(), respuesta.cliente().rut());
        assertEquals(cliente.getComuna(), respuesta.cliente().comuna());
    }

    @Test
    void loginConPasswordIncorrectoLanzaCredencialesInvalidas() {
        // Arrange
        Usuario usuario = DatosPrueba.usuario("USER", codificador.encode("Clave123"));
        when(usuarios.findByCorreo(usuario.getCorreo())).thenReturn(Optional.of(usuario));

        // Act + Assert
        assertThrows(CredencialesInvalidasException.class,
                () -> servicio.login(new LoginRequest(usuario.getCorreo(), "OtraClave9")));
    }

    @Test
    void loginConCorreoInexistenteLanzaCredencialesInvalidas() {
        // Arrange
        String correo = DatosPrueba.correo();
        when(usuarios.findByCorreo(correo)).thenReturn(Optional.empty());

        // Act + Assert
        assertThrows(CredencialesInvalidasException.class,
                () -> servicio.login(new LoginRequest(correo, "Clave123")));
    }

    // ---------- registro ----------

    @Test
    void registrarConCorreoRepetidoLanzaConflicto() {
        // Arrange
        RegistroRequest datos = DatosPrueba.registroRequest();
        when(usuarios.existsByCorreo(datos.correo())).thenReturn(true);

        // Act + Assert
        assertThrows(ConflictoException.class, () -> servicio.registrar(datos));
        verify(usuarios, never()).save(any(Usuario.class));
        verify(clientes, never()).saveAndFlush(any(Cliente.class));
    }

    @Test
    void registrarConRutRepetidoLanzaConflictoYNoGuardaNada() {
        // Arrange
        RegistroRequest datos = DatosPrueba.registroRequest();
        when(usuarios.existsByCorreo(datos.correo())).thenReturn(false);
        when(clientes.existsByCorreo(datos.correo())).thenReturn(false);
        when(clientes.existsByRut(any(String.class))).thenReturn(true);

        // Act + Assert
        assertThrows(ConflictoException.class, () -> servicio.registrar(datos));
        verify(usuarios, never()).save(any(Usuario.class));
        verify(clientes, never()).saveAndFlush(any(Cliente.class));
    }

    @Test
    void registrarGuardaElUsuarioConPasswordCifradaYLaFichaDelCliente() {
        // Arrange
        RegistroRequest datos = new RegistroRequest(
                "  Maria Soto ", "MARIA@Correo.CL", "Clave123", "12345678-5", "+56 9 1234 5678",
                "contratista", "coquimbo", "La Serena");
        when(usuarios.save(any(Usuario.class))).thenAnswer(llamada -> llamada.getArgument(0));
        when(clientes.saveAndFlush(any(Cliente.class))).thenAnswer(llamada -> llamada.getArgument(0));

        // Act
        AuthResponse respuesta = servicio.registrar(datos);

        // Assert
        ArgumentCaptor<Usuario> capturaUsuario = ArgumentCaptor.forClass(Usuario.class);
        ArgumentCaptor<Cliente> capturaCliente = ArgumentCaptor.forClass(Cliente.class);
        verify(usuarios).save(capturaUsuario.capture());
        verify(clientes).saveAndFlush(capturaCliente.capture());

        Usuario usuario = capturaUsuario.getValue();
        assertNotEquals("Clave123", usuario.getPassword());
        assertTrue(codificador.matches("Clave123", usuario.getPassword()));
        assertEquals("USER", usuario.getRol());
        assertEquals("maria@correo.cl", usuario.getCorreo());

        Cliente cliente = capturaCliente.getValue();
        assertEquals("12.345.678-5", cliente.getRut());
        assertEquals("Maria Soto", cliente.getNombre());
        assertEquals("contratista", cliente.getTipoCliente());

        assertNotNull(respuesta.token());
        assertEquals("contratista", respuesta.cliente().tipoCliente());
    }
}
