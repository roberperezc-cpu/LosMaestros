package cl.losmaestros.api.assembler;

import cl.losmaestros.api.controller.ProductoController;
import cl.losmaestros.api.model.Producto;
import org.springframework.hateoas.EntityModel;
import org.springframework.hateoas.server.RepresentationModelAssembler;
import org.springframework.stereotype.Component;

import static org.springframework.hateoas.server.mvc.WebMvcLinkBuilder.linkTo;
import static org.springframework.hateoas.server.mvc.WebMvcLinkBuilder.methodOn;

/** Agrega enlaces HATEOAS (_links) a cada Producto: el suyo (self) y el de la colección. */
@Component
public class ProductoModelAssembler implements RepresentationModelAssembler<Producto, EntityModel<Producto>> {

    @Override
    public EntityModel<Producto> toModel(Producto entidad) {
        return EntityModel.of(entidad,
                linkTo(methodOn(ProductoController.class).buscarPorId(entidad.getId())).withSelfRel(),
                linkTo(methodOn(ProductoController.class).obtenerTodos()).withRel("productos"));
    }
}
