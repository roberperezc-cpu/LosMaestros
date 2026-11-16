package cl.losmaestros.api.controller;

import cl.losmaestros.api.assembler.ProductoModelAssembler;
import cl.losmaestros.api.dto.ProductoRequest;
import cl.losmaestros.api.model.Producto;
import cl.losmaestros.api.service.ProductoService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.Parameter;
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

/** Endpoints CRUD de productos: /api/productos */
@RestController
@RequestMapping("/api/productos")
@Tag(name = "Productos", description = "Catálogo de productos. Consultar (GET) es público; crear, modificar y eliminar requiere rol ADMIN.")
public class ProductoController {

    private final ProductoService servicio;
    private final ProductoModelAssembler ensamblador;

    public ProductoController(ProductoService servicio, ProductoModelAssembler ensamblador) {
        this.servicio = servicio;
        this.ensamblador = ensamblador;
    }

    @GetMapping
    @Operation(summary = "Obtener todos los productos", description = "Devuelve la lista de productos con enlaces HATEOAS (_links).")
    @ApiResponse(responseCode = "200", description = "Lista de productos")
    public CollectionModel<EntityModel<Producto>> obtenerTodos() {
        CollectionModel<EntityModel<Producto>> coleccion = ensamblador.toCollectionModel(servicio.obtenerTodos());
        coleccion.add(linkTo(methodOn(ProductoController.class).obtenerTodos()).withSelfRel());
        return coleccion;
    }

    @GetMapping("/{id}")
    @Operation(summary = "Buscar un producto por SKU", description = "Devuelve el producto con sus enlaces HATEOAS.")
    @ApiResponse(responseCode = "200", description = "Producto encontrado")
    @ApiResponse(responseCode = "404", description = "No existe un producto con ese SKU")
    public EntityModel<Producto> buscarPorId(@Parameter(description = "SKU del producto", example = "MAT-CEM-001") @PathVariable String id) {
        return ensamblador.toModel(servicio.buscarPorId(id));
    }

    @PostMapping
    @ResponseStatus(HttpStatus.CREATED)
    @Operation(summary = "Crear un producto", description = "Requiere token de ADMIN.")
    @ApiResponse(responseCode = "201", description = "Producto creado")
    @ApiResponse(responseCode = "400", description = "Datos inválidos")
    @ApiResponse(responseCode = "401", description = "Falta el token JWT")
    @ApiResponse(responseCode = "403", description = "El usuario no es ADMIN")
    @ApiResponse(responseCode = "409", description = "El SKU ya existe")
    public Producto guardar(@Valid @RequestBody ProductoRequest datos) {
        return servicio.guardar(datos);
    }

    @PutMapping("/{id}")
    @Operation(summary = "Actualizar un producto", description = "Requiere token de ADMIN. El SKU no cambia.")
    @ApiResponse(responseCode = "200", description = "Producto actualizado")
    @ApiResponse(responseCode = "400", description = "Datos inválidos")
    @ApiResponse(responseCode = "403", description = "El usuario no es ADMIN")
    @ApiResponse(responseCode = "404", description = "No existe un producto con ese SKU")
    public Producto actualizar(@PathVariable String id, @Valid @RequestBody ProductoRequest datos) {
        return servicio.actualizar(id, datos);
    }

    @DeleteMapping("/{id}")
    @ResponseStatus(HttpStatus.NO_CONTENT)
    @Operation(summary = "Eliminar un producto", description = "Requiere token de ADMIN.")
    @ApiResponse(responseCode = "204", description = "Producto eliminado")
    @ApiResponse(responseCode = "403", description = "El usuario no es ADMIN")
    @ApiResponse(responseCode = "404", description = "No existe un producto con ese SKU")
    public void eliminar(@PathVariable String id) {
        servicio.eliminar(id);
    }
}
