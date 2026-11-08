package cl.losmaestros.api.controller;

import cl.losmaestros.api.dto.ClienteRequest;
import cl.losmaestros.api.exception.RecursoNoEncontradoException;
import cl.losmaestros.api.model.Cliente;
import cl.losmaestros.api.service.ClienteService;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.web.servlet.WebMvcTest;
import org.springframework.http.MediaType;
import org.springframework.test.context.bean.override.mockito.MockitoBean;
import org.springframework.test.web.servlet.MockMvc;

import java.util.List;

import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.when;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.delete;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.get;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.post;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.jsonPath;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.status;

@WebMvcTest(ClienteController.class)
class ClienteControllerTest {

    private static final String JSON_VALIDO = """
            {"rut":"12.345.678-5","nombre":"Constructora Elqui","correo":"contratista@losmaestros.cl",
             "telefono":"+56 9 8765 4321","tipoCliente":"contratista","region":"coquimbo","comuna":"Coquimbo"}
            """;

    @Autowired
    private MockMvc mockMvc;

    @MockitoBean
    private ClienteService servicio;

    private Cliente clienteDeEjemplo() {
        Cliente c = new Cliente();
        c.setId(1L);
        c.setRut("12.345.678-5");
        c.setNombre("Constructora Elqui");
        c.setCorreo("contratista@losmaestros.cl");
        c.setTelefono("+56 9 8765 4321");
        c.setTipoCliente("contratista");
        c.setRegion("coquimbo");
        c.setComuna("Coquimbo");
        return c;
    }

    @Test
    void obtenerTodosDevuelveLosClientes() throws Exception {
        // Arrange
        when(servicio.obtenerTodos()).thenReturn(List.of(clienteDeEjemplo()));

        // Act + Assert
        mockMvc.perform(get("/api/clientes"))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$[0].rut").value("12.345.678-5"));
    }

    @Test
    void buscarPorIdInexistenteDevuelve404() throws Exception {
        // Arrange
        when(servicio.buscarPorId(99L)).thenThrow(new RecursoNoEncontradoException("Cliente no encontrado: 99"));

        // Act + Assert
        mockMvc.perform(get("/api/clientes/99"))
                .andExpect(status().isNotFound())
                .andExpect(jsonPath("$.mensaje").value("Cliente no encontrado: 99"));
    }

    @Test
    void guardarConDatosValidosDevuelve201() throws Exception {
        // Arrange
        when(servicio.guardar(any(ClienteRequest.class))).thenReturn(clienteDeEjemplo());

        // Act + Assert
        mockMvc.perform(post("/api/clientes").contentType(MediaType.APPLICATION_JSON).content(JSON_VALIDO))
                .andExpect(status().isCreated())
                .andExpect(jsonPath("$.id").value(1));
    }

    @Test
    void guardarConCorreoInvalidoDevuelve400() throws Exception {
        // Arrange
        String json = JSON_VALIDO.replace("contratista@losmaestros.cl", "correo-sin-arroba");

        // Act + Assert
        mockMvc.perform(post("/api/clientes").contentType(MediaType.APPLICATION_JSON).content(json))
                .andExpect(status().isBadRequest())
                .andExpect(jsonPath("$.errores.correo").exists());
    }

    @Test
    void eliminarDevuelve204() throws Exception {
        // Act + Assert
        mockMvc.perform(delete("/api/clientes/1"))
                .andExpect(status().isNoContent());
    }
}
