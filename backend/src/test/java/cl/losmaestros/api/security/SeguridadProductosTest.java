package cl.losmaestros.api.security;

import cl.losmaestros.api.assembler.ProductoModelAssembler;
import cl.losmaestros.api.controller.ProductoController;
import cl.losmaestros.api.dto.ProductoRequest;
import cl.losmaestros.api.model.Producto;
import cl.losmaestros.api.service.ProductoService;
import cl.losmaestros.api.util.DatosPrueba;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.web.servlet.WebMvcTest;
import org.springframework.context.annotation.Import;
import org.springframework.http.MediaType;
import org.springframework.test.context.bean.override.mockito.MockitoBean;
import org.springframework.test.web.servlet.MockMvc;

import java.util.List;

import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.when;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.get;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.post;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.jsonPath;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.status;

/**
 * Prueba las reglas de acceso reales (SecurityConfig + JwtAuthFilter + JwtService),
 * con el servicio de productos reemplazado por un mock (no usa base de datos).
 */
@WebMvcTest(ProductoController.class)
@Import({SecurityConfig.class, JwtService.class, ProductoModelAssembler.class})
class SeguridadProductosTest {

    private static final String JSON_VALIDO = """
            {"id":"HER-MAR-010","nombre":"Martillo Carpintero 16oz","categoria":"herramientas-man",
             "categoriaNombre":"Herramientas Manuales","precio":9990,"stock":25,"stockMinimo":5,
             "ubicacion":"Pasillo C - Estante 1"}
            """;

    @Autowired
    private MockMvc mockMvc;

    @Autowired
    private JwtService jwtService;

    @MockitoBean
    private ProductoService servicio;

    private String tokenDe(String rol) {
        return jwtService.generarToken(DatosPrueba.usuario(rol, "hash"));
    }

    @Test
    void consultarProductosEsPublico() throws Exception {
        // Arrange
        Producto producto = DatosPrueba.producto();
        when(servicio.obtenerTodos()).thenReturn(List.of(producto));

        // Act + Assert
        mockMvc.perform(get("/api/productos"))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$._embedded.productos[0].id").value(producto.getId()));
    }

    @Test
    void crearUnProductoSinTokenDevuelve401() throws Exception {
        // Act + Assert
        mockMvc.perform(post("/api/productos").contentType(MediaType.APPLICATION_JSON).content(JSON_VALIDO))
                .andExpect(status().isUnauthorized())
                .andExpect(jsonPath("$.mensaje").exists());
    }

    @Test
    void crearUnProductoConTokenInvalidoDevuelve401() throws Exception {
        // Act + Assert
        mockMvc.perform(post("/api/productos").contentType(MediaType.APPLICATION_JSON).content(JSON_VALIDO)
                        .header("Authorization", "Bearer token-falso"))
                .andExpect(status().isUnauthorized());
    }

    @Test
    void crearUnProductoConTokenDeUserDevuelve403() throws Exception {
        // Act + Assert
        mockMvc.perform(post("/api/productos").contentType(MediaType.APPLICATION_JSON).content(JSON_VALIDO)
                        .header("Authorization", "Bearer " + tokenDe("USER")))
                .andExpect(status().isForbidden());
    }

    @Test
    void crearUnProductoConTokenDeAdminDevuelve201() throws Exception {
        // Arrange
        when(servicio.guardar(any(ProductoRequest.class))).thenReturn(DatosPrueba.producto());

        // Act + Assert
        mockMvc.perform(post("/api/productos").contentType(MediaType.APPLICATION_JSON).content(JSON_VALIDO)
                        .header("Authorization", "Bearer " + tokenDe("ADMIN")))
                .andExpect(status().isCreated());
    }
}
