package cl.losmaestros.api.controller;

import cl.losmaestros.api.dto.VentaRequest;
import cl.losmaestros.api.model.Venta;
import cl.losmaestros.api.service.VentaService;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.web.servlet.WebMvcTest;
import org.springframework.http.MediaType;
import org.springframework.test.context.bean.override.mockito.MockitoBean;
import org.springframework.test.web.servlet.MockMvc;

import java.time.LocalDateTime;
import java.util.List;

import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.when;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.get;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.post;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.jsonPath;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.status;

@WebMvcTest(VentaController.class)
class VentaControllerTest {

    private static final String JSON_VALIDO = """
            {"clienteId":1,"productoId":"MAT-CEM-001","cantidad":2,"precioUnitario":4890,
             "tipoEntrega":"retiro","metodoPago":"transferencia"}
            """;

    @Autowired
    private MockMvc mockMvc;

    @MockitoBean
    private VentaService servicio;

    private Venta ventaDeEjemplo() {
        Venta v = new Venta();
        v.setId(1L);
        v.setFecha(LocalDateTime.of(2026, 11, 9, 10, 30));
        v.setClienteId(1L);
        v.setProductoId("MAT-CEM-001");
        v.setCantidad(2);
        v.setPrecioUnitario(4890);
        v.setTotal(9780);
        v.setTipoEntrega("retiro");
        v.setMetodoPago("transferencia");
        return v;
    }

    @Test
    void obtenerTodosDevuelveLasVentas() throws Exception {
        // Arrange
        when(servicio.obtenerTodos()).thenReturn(List.of(ventaDeEjemplo()));

        // Act + Assert
        mockMvc.perform(get("/api/ventas"))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$[0].total").value(9780));
    }

    @Test
    void guardarConDatosValidosDevuelve201() throws Exception {
        // Arrange
        when(servicio.guardar(any(VentaRequest.class))).thenReturn(ventaDeEjemplo());

        // Act + Assert
        mockMvc.perform(post("/api/ventas").contentType(MediaType.APPLICATION_JSON).content(JSON_VALIDO))
                .andExpect(status().isCreated())
                .andExpect(jsonPath("$.productoId").value("MAT-CEM-001"));
    }

    @Test
    void guardarConCantidadCeroDevuelve400() throws Exception {
        // Arrange
        String json = JSON_VALIDO.replace("\"cantidad\":2", "\"cantidad\":0");

        // Act + Assert
        mockMvc.perform(post("/api/ventas").contentType(MediaType.APPLICATION_JSON).content(json))
                .andExpect(status().isBadRequest())
                .andExpect(jsonPath("$.errores.cantidad").exists());
    }

    @Test
    void guardarConMetodoDePagoInvalidoDevuelve400() throws Exception {
        // Arrange
        String json = JSON_VALIDO.replace("transferencia", "bitcoin");

        // Act + Assert
        mockMvc.perform(post("/api/ventas").contentType(MediaType.APPLICATION_JSON).content(json))
                .andExpect(status().isBadRequest())
                .andExpect(jsonPath("$.errores.metodoPago").exists());
    }
}
