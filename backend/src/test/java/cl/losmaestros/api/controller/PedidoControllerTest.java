package cl.losmaestros.api.controller;

import cl.losmaestros.api.dto.PedidoRequest;
import cl.losmaestros.api.dto.PedidoResponse;
import cl.losmaestros.api.exception.ConflictoException;
import cl.losmaestros.api.service.PedidoService;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.web.servlet.AutoConfigureMockMvc;
import org.springframework.boot.test.autoconfigure.web.servlet.WebMvcTest;
import org.springframework.http.MediaType;
import org.springframework.test.context.bean.override.mockito.MockitoBean;
import org.springframework.test.web.servlet.MockMvc;

import java.time.LocalDateTime;
import java.util.List;

import static org.mockito.ArgumentMatchers.any;
import static org.mockito.ArgumentMatchers.eq;
import static org.mockito.Mockito.when;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.post;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.jsonPath;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.status;

/** Prueba solo la capa web: la seguridad se desactiva aquí (se prueba aparte) y el servicio es un mock. */
@WebMvcTest(PedidoController.class)
@AutoConfigureMockMvc(addFilters = false)
class PedidoControllerTest {

    private static final String PEDIDO_VALIDO = """
            {"tipoEntrega":"retiro","metodoPago":"transferencia",
             "items":[{"productoId":"MAT-CEM-001","cantidad":2}]}
            """;

    @Autowired
    private MockMvc mockMvc;

    @MockitoBean
    private PedidoService servicio;

    private PedidoResponse comprobanteDeEjemplo() {
        return new PedidoResponse("PED-261123-043015-47", LocalDateTime.of(2026, 11, 23, 4, 30, 15), 9780,
                "retiro", "transferencia", null,
                List.of(new PedidoResponse.Linea("MAT-CEM-001", "Saco de Cemento Melón 25kg", 2, 4890, 9780)));
    }

    @Test
    void confirmarConDatosValidosDevuelve201ConElComprobante() throws Exception {
        // Arrange
        when(servicio.confirmar(any(PedidoRequest.class), eq("maria@correo.cl"))).thenReturn(comprobanteDeEjemplo());

        // Act + Assert
        mockMvc.perform(post("/api/pedidos").principal(() -> "maria@correo.cl")
                        .contentType(MediaType.APPLICATION_JSON).content(PEDIDO_VALIDO))
                .andExpect(status().isCreated())
                .andExpect(jsonPath("$.numeroPedido").value("PED-261123-043015-47"))
                .andExpect(jsonPath("$.total").value(9780))
                .andExpect(jsonPath("$.lineas[0].nombre").value("Saco de Cemento Melón 25kg"));
    }

    @Test
    void confirmarSinProductosDevuelve400() throws Exception {
        // Arrange
        String json = """
                {"tipoEntrega":"retiro","metodoPago":"transferencia","items":[]}
                """;

        // Act + Assert
        mockMvc.perform(post("/api/pedidos").principal(() -> "maria@correo.cl")
                        .contentType(MediaType.APPLICATION_JSON).content(json))
                .andExpect(status().isBadRequest())
                .andExpect(jsonPath("$.errores.items").exists());
    }

    @Test
    void confirmarConMetodoDePagoInvalidoDevuelve400() throws Exception {
        // Arrange
        String json = PEDIDO_VALIDO.replace("transferencia", "bitcoin");

        // Act + Assert
        mockMvc.perform(post("/api/pedidos").principal(() -> "maria@correo.cl")
                        .contentType(MediaType.APPLICATION_JSON).content(json))
                .andExpect(status().isBadRequest())
                .andExpect(jsonPath("$.errores.metodoPago").exists());
    }

    @Test
    void confirmarConStockInsuficienteDevuelve409() throws Exception {
        // Arrange
        when(servicio.confirmar(any(PedidoRequest.class), eq("maria@correo.cl")))
                .thenThrow(new ConflictoException("Stock insuficiente de \"Taladro\": quedan 1 unidades."));

        // Act + Assert
        mockMvc.perform(post("/api/pedidos").principal(() -> "maria@correo.cl")
                        .contentType(MediaType.APPLICATION_JSON).content(PEDIDO_VALIDO))
                .andExpect(status().isConflict())
                .andExpect(jsonPath("$.mensaje").value("Stock insuficiente de \"Taladro\": quedan 1 unidades."));
    }
}
