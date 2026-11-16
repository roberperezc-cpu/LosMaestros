package cl.losmaestros.api.assembler;

import cl.losmaestros.api.controller.VentaController;
import cl.losmaestros.api.model.Venta;
import org.springframework.hateoas.EntityModel;
import org.springframework.hateoas.server.RepresentationModelAssembler;
import org.springframework.stereotype.Component;

import static org.springframework.hateoas.server.mvc.WebMvcLinkBuilder.linkTo;
import static org.springframework.hateoas.server.mvc.WebMvcLinkBuilder.methodOn;

/** Agrega enlaces HATEOAS (_links) a cada Venta: el suyo (self) y el de la colección. */
@Component
public class VentaModelAssembler implements RepresentationModelAssembler<Venta, EntityModel<Venta>> {

    @Override
    public EntityModel<Venta> toModel(Venta entidad) {
        return EntityModel.of(entidad,
                linkTo(methodOn(VentaController.class).buscarPorId(entidad.getId())).withSelfRel(),
                linkTo(methodOn(VentaController.class).obtenerTodos()).withRel("ventas"));
    }
}
