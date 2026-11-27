package cl.losmaestros.api.controller;

import cl.losmaestros.api.dto.PedidoRequest;
import cl.losmaestros.api.dto.PedidoResponse;
import cl.losmaestros.api.service.PedidoService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.responses.ApiResponse;
import io.swagger.v3.oas.annotations.tags.Tag;
import jakarta.validation.Valid;
import org.springframework.http.HttpStatus;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.ResponseStatus;
import org.springframework.web.bind.annotation.RestController;

import java.security.Principal;

/** Checkout del carrito: /api/pedidos */
@RestController
@RequestMapping("/api/pedidos")
@Tag(name = "Pedidos", description = "Confirmación de la compra del carrito. Requiere token de un cliente registrado.")
public class PedidoController {

    private final PedidoService servicio;

    public PedidoController(PedidoService servicio) {
        this.servicio = servicio;
    }

    @PostMapping
    @ResponseStatus(HttpStatus.CREATED)
    @Operation(summary = "Confirmar una compra",
            description = "Descuenta el stock de cada producto y registra las ventas. El cliente se identifica por el token.")
    @ApiResponse(responseCode = "201", description = "Compra confirmada; devuelve el comprobante")
    @ApiResponse(responseCode = "400", description = "Datos inválidos o la cuenta no tiene ficha de cliente")
    @ApiResponse(responseCode = "401", description = "Falta el token JWT")
    @ApiResponse(responseCode = "404", description = "Algún producto no existe")
    @ApiResponse(responseCode = "409", description = "Stock insuficiente")
    public PedidoResponse confirmar(@Valid @RequestBody PedidoRequest datos, Principal usuario) {
        return servicio.confirmar(datos, usuario.getName());
    }
}
