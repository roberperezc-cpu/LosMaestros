package cl.losmaestros.api.controller;

import cl.losmaestros.api.dto.AuthResponse;
import cl.losmaestros.api.dto.LoginRequest;
import cl.losmaestros.api.dto.RegistroRequest;
import cl.losmaestros.api.exception.ConflictoException;
import cl.losmaestros.api.exception.CredencialesInvalidasException;
import cl.losmaestros.api.service.AuthService;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.web.servlet.AutoConfigureMockMvc;
import org.springframework.boot.test.autoconfigure.web.servlet.WebMvcTest;
import org.springframework.http.MediaType;
import org.springframework.test.context.bean.override.mockito.MockitoBean;
import org.springframework.test.web.servlet.MockMvc;

import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.when;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.post;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.jsonPath;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.status;

/** Prueba solo la capa web: la seguridad se desactiva aquí (se prueba aparte) y el servicio es un mock. */
@WebMvcTest(AuthController.class)
@AutoConfigureMockMvc(addFilters = false)
class AuthControllerTest {

    private static final String REGISTRO_VALIDO = """
            {"nombre":"Maria Soto","correo":"maria@correo.cl","password":"Clave123",
             "rut":"12.345.678-5","telefono":"+56 9 1234 5678","tipoCliente":"contratista",
             "region":"coquimbo","comuna":"La Serena"}
            """;

    private static final String LOGIN_VALIDO = """
            {"correo":"admin@losmaestros.cl","password":"Admin123"}
            """;

    @Autowired
    private MockMvc mockMvc;

    @MockitoBean
    private AuthService servicio;

    private AuthResponse respuestaDeEjemplo() {
        return new AuthResponse("token-de-ejemplo", "Bearer", 60,
                new AuthResponse.UsuarioInfo(1L, "Maria Soto", "maria@correo.cl", "USER"),
                new AuthResponse.ClienteInfo("12.345.678-5", "+56 9 1234 5678", "contratista", "coquimbo", "La Serena"));
    }

    @Test
    void registrarConDatosValidosDevuelve201ConElToken() throws Exception {
        // Arrange
        when(servicio.registrar(any(RegistroRequest.class))).thenReturn(respuestaDeEjemplo());

        // Act + Assert
        mockMvc.perform(post("/api/auth/registro").contentType(MediaType.APPLICATION_JSON).content(REGISTRO_VALIDO))
                .andExpect(status().isCreated())
                .andExpect(jsonPath("$.token").value("token-de-ejemplo"))
                .andExpect(jsonPath("$.cliente.rut").value("12.345.678-5"));
    }

    @Test
    void registrarConRutInvalidoDevuelve400ConElErrorDelCampo() throws Exception {
        // Arrange
        String json = REGISTRO_VALIDO.replace("12.345.678-5", "abc");

        // Act + Assert
        mockMvc.perform(post("/api/auth/registro").contentType(MediaType.APPLICATION_JSON).content(json))
                .andExpect(status().isBadRequest())
                .andExpect(jsonPath("$.errores.rut").exists());
    }

    @Test
    void registrarConCorreoRepetidoDevuelve409() throws Exception {
        // Arrange
        when(servicio.registrar(any(RegistroRequest.class)))
                .thenThrow(new ConflictoException("Ya existe una cuenta con ese correo."));

        // Act + Assert
        mockMvc.perform(post("/api/auth/registro").contentType(MediaType.APPLICATION_JSON).content(REGISTRO_VALIDO))
                .andExpect(status().isConflict())
                .andExpect(jsonPath("$.mensaje").value("Ya existe una cuenta con ese correo."));
    }

    @Test
    void loginConCredencialesCorrectasDevuelve200() throws Exception {
        // Arrange
        when(servicio.login(any(LoginRequest.class))).thenReturn(respuestaDeEjemplo());

        // Act + Assert
        mockMvc.perform(post("/api/auth/login").contentType(MediaType.APPLICATION_JSON).content(LOGIN_VALIDO))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.usuario.rol").value("USER"));
    }

    @Test
    void loginConCredencialesIncorrectasDevuelve401() throws Exception {
        // Arrange
        when(servicio.login(any(LoginRequest.class)))
                .thenThrow(new CredencialesInvalidasException("Correo o contraseña incorrectos."));

        // Act + Assert
        mockMvc.perform(post("/api/auth/login").contentType(MediaType.APPLICATION_JSON).content(LOGIN_VALIDO))
                .andExpect(status().isUnauthorized())
                .andExpect(jsonPath("$.mensaje").value("Correo o contraseña incorrectos."));
    }
}
