package cl.losmaestros.api.controller;

import cl.losmaestros.api.dto.ProductoRequest;
import cl.losmaestros.api.exception.ConflictoException;
import cl.losmaestros.api.exception.RecursoNoEncontradoException;
import cl.losmaestros.api.model.Producto;
import cl.losmaestros.api.service.ProductoService;
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
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.put;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.jsonPath;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.status;

/** Prueba solo la capa web (sin base de datos): el servicio se reemplaza por un mock. */
@WebMvcTest(ProductoController.class)
class ProductoControllerTest {

    private static final String JSON_VALIDO = """
            {"id":"HER-MAR-010","nombre":"Martillo Carpintero 16oz","categoria":"herramientas-man",
             "categoriaNombre":"Herramientas Manuales","precio":9990,"stock":25,"stockMinimo":5,
             "ubicacion":"Pasillo C - Estante 1"}
            """;

    @Autowired
    private MockMvc mockMvc;

    @MockitoBean
    private ProductoService servicio;

    private Producto productoDeEjemplo() {
        Producto p = new Producto();
        p.setId("MAT-CEM-001");
        p.setNombre("Saco de Cemento Melón 25kg");
        p.setCategoria("construccion");
        p.setCategoriaNombre("Construcción");
        p.setPrecio(4890);
        p.setStock(142);
        p.setStockMinimo(20);
        p.setUbicacion("Bodega Patio - Sector A");
        return p;
    }

    @Test
    void obtenerTodosDevuelveLosProductos() throws Exception {
        // Arrange
        when(servicio.obtenerTodos()).thenReturn(List.of(productoDeEjemplo()));

        // Act + Assert
        mockMvc.perform(get("/api/productos"))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$[0].id").value("MAT-CEM-001"))
                .andExpect(jsonPath("$[0].stockMinimo").value(20));
    }

    @Test
    void buscarPorIdInexistenteDevuelve404() throws Exception {
        // Arrange
        when(servicio.buscarPorId("XXX-XXX-999"))
                .thenThrow(new RecursoNoEncontradoException("Producto no encontrado: XXX-XXX-999"));

        // Act + Assert
        mockMvc.perform(get("/api/productos/XXX-XXX-999"))
                .andExpect(status().isNotFound())
                .andExpect(jsonPath("$.mensaje").value("Producto no encontrado: XXX-XXX-999"));
    }

    @Test
    void guardarConDatosValidosDevuelve201() throws Exception {
        // Arrange
        when(servicio.guardar(any(ProductoRequest.class))).thenReturn(productoDeEjemplo());

        // Act + Assert
        mockMvc.perform(post("/api/productos").contentType(MediaType.APPLICATION_JSON).content(JSON_VALIDO))
                .andExpect(status().isCreated())
                .andExpect(jsonPath("$.id").value("MAT-CEM-001"));
    }

    @Test
    void guardarConSkuInvalidoDevuelve400ConElErrorDelCampo() throws Exception {
        // Arrange
        String json = JSON_VALIDO.replace("HER-MAR-010", "martillo1");

        // Act + Assert
        mockMvc.perform(post("/api/productos").contentType(MediaType.APPLICATION_JSON).content(json))
                .andExpect(status().isBadRequest())
                .andExpect(jsonPath("$.errores.id").exists());
    }

    @Test
    void guardarConSkuRepetidoDevuelve409() throws Exception {
        // Arrange
        when(servicio.guardar(any(ProductoRequest.class)))
                .thenThrow(new ConflictoException("Ya existe un producto con ese SKU."));

        // Act + Assert
        mockMvc.perform(post("/api/productos").contentType(MediaType.APPLICATION_JSON).content(JSON_VALIDO))
                .andExpect(status().isConflict())
                .andExpect(jsonPath("$.mensaje").value("Ya existe un producto con ese SKU."));
    }

    @Test
    void actualizarDevuelveElProductoModificado() throws Exception {
        // Arrange
        when(servicio.actualizar(any(String.class), any(ProductoRequest.class))).thenReturn(productoDeEjemplo());

        // Act + Assert
        mockMvc.perform(put("/api/productos/HER-MAR-010").contentType(MediaType.APPLICATION_JSON).content(JSON_VALIDO))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.nombre").value("Saco de Cemento Melón 25kg"));
    }

    @Test
    void eliminarDevuelve204() throws Exception {
        // Act + Assert
        mockMvc.perform(delete("/api/productos/HER-MAR-010"))
                .andExpect(status().isNoContent());
    }
}
