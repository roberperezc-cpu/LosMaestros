package cl.losmaestros.api.controller;

import cl.losmaestros.api.assembler.ClienteModelAssembler;
import cl.losmaestros.api.dto.ClienteRequest;
import cl.losmaestros.api.model.Cliente;
import cl.losmaestros.api.service.ClienteService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.responses.ApiResponse;
import io.swagger.v3.oas.annotations.tags.Tag;
import jakarta.validation.Valid;
import org.springframework.hateoas.CollectionModel;
import org.springframework.hateoas.EntityModel;
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

import static org.springframework.hateoas.server.mvc.WebMvcLinkBuilder.linkTo;
import static org.springframework.hateoas.server.mvc.WebMvcLinkBuilder.methodOn;

/** Endpoints CRUD de clientes: /api/clientes */
@RestController
@RequestMapping("/api/clientes")
@Tag(name = "Clientes", description = "Clientes de la ferretería. Todas las operaciones requieren token; eliminar requiere rol ADMIN.")
public class ClienteController {

    private final ClienteService servicio;
    private final ClienteModelAssembler ensamblador;

    public ClienteController(ClienteService servicio, ClienteModelAssembler ensamblador) {
        this.servicio = servicio;
        this.ensamblador = ensamblador;
    }

    @GetMapping
    @Operation(summary = "Obtener todos (clientes)", description = "Devuelve la lista con enlaces HATEOAS (_links). Requiere token.")
    @ApiResponse(responseCode = "200", description = "Lista obtenida")
    @ApiResponse(responseCode = "401", description = "Falta el token JWT")
    public CollectionModel<EntityModel<Cliente>> obtenerTodos() {
        CollectionModel<EntityModel<Cliente>> coleccion = ensamblador.toCollectionModel(servicio.obtenerTodos());
        coleccion.add(linkTo(methodOn(ClienteController.class).obtenerTodos()).withSelfRel());
        return coleccion;
    }

    @GetMapping("/{id}")
    @Operation(summary = "Buscar por ID", description = "Devuelve el registro con sus enlaces HATEOAS. Requiere token.")
    @ApiResponse(responseCode = "200", description = "Registro encontrado")
    @ApiResponse(responseCode = "401", description = "Falta el token JWT")
    @ApiResponse(responseCode = "404", description = "No existe un registro con ese id")
    public EntityModel<Cliente> buscarPorId(@PathVariable Long id) {
        return ensamblador.toModel(servicio.buscarPorId(id));
    }

    @PostMapping
    @ResponseStatus(HttpStatus.CREATED)
    @Operation(summary = "Guardar / crear", description = "Crea un registro nuevo. Requiere token.")
    @ApiResponse(responseCode = "201", description = "Registro creado")
    @ApiResponse(responseCode = "400", description = "Datos inválidos")
    @ApiResponse(responseCode = "401", description = "Falta el token JWT")
    @ApiResponse(responseCode = "409", description = "Dato repetido (por ejemplo RUT o correo)")
    public Cliente guardar(@Valid @RequestBody ClienteRequest datos) {
        return servicio.guardar(datos);
    }

    @PutMapping("/{id}")
    @Operation(summary = "Actualizar", description = "Modifica un registro existente. Requiere token.")
    @ApiResponse(responseCode = "200", description = "Registro actualizado")
    @ApiResponse(responseCode = "400", description = "Datos inválidos")
    @ApiResponse(responseCode = "401", description = "Falta el token JWT")
    @ApiResponse(responseCode = "404", description = "No existe un registro con ese id")
    public Cliente actualizar(@PathVariable Long id, @Valid @RequestBody ClienteRequest datos) {
        return servicio.actualizar(id, datos);
    }

    @DeleteMapping("/{id}")
    @ResponseStatus(HttpStatus.NO_CONTENT)
    @Operation(summary = "Eliminar", description = "Elimina un registro. Requiere token de ADMIN.")
    @ApiResponse(responseCode = "204", description = "Registro eliminado")
    @ApiResponse(responseCode = "403", description = "El usuario no es ADMIN")
    @ApiResponse(responseCode = "404", description = "No existe un registro con ese id")
    public void eliminar(@PathVariable Long id) {
        servicio.eliminar(id);
    }
}
