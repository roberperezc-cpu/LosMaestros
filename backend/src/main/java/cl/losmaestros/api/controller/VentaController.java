package cl.losmaestros.api.controller;

import cl.losmaestros.api.dto.VentaRequest;
import cl.losmaestros.api.model.Venta;
import cl.losmaestros.api.service.VentaService;
import jakarta.validation.Valid;
import org.springframework.http.HttpStatus;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.ResponseStatus;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;

/** Endpoints CRUD de ventas: /api/ventas */
@RestController
@RequestMapping("/api/ventas")
public class VentaController {

    private final VentaService servicio;

    public VentaController(VentaService servicio) {
        this.servicio = servicio;
    }

    @GetMapping
    public List<Venta> obtenerTodos() {
        return servicio.obtenerTodos();
    }

    @GetMapping("/{id}")
    public Venta buscarPorId(@PathVariable Long id) {
        return servicio.buscarPorId(id);
    }

    @PostMapping
    @ResponseStatus(HttpStatus.CREATED)
    public Venta guardar(@Valid @RequestBody VentaRequest datos) {
        return servicio.guardar(datos);
    }

    @PutMapping("/{id}")
    public Venta actualizar(@PathVariable Long id, @Valid @RequestBody VentaRequest datos) {
        return servicio.actualizar(id, datos);
    }

    @DeleteMapping("/{id}")
    @ResponseStatus(HttpStatus.NO_CONTENT)
    public void eliminar(@PathVariable Long id) {
        servicio.eliminar(id);
    }
}
