package cl.losmaestros.api.assembler;

import cl.losmaestros.api.controller.ClienteController;
import cl.losmaestros.api.model.Cliente;
import org.springframework.hateoas.EntityModel;
import org.springframework.hateoas.server.RepresentationModelAssembler;
import org.springframework.stereotype.Component;

import static org.springframework.hateoas.server.mvc.WebMvcLinkBuilder.linkTo;
import static org.springframework.hateoas.server.mvc.WebMvcLinkBuilder.methodOn;

/** Agrega enlaces HATEOAS (_links) a cada Cliente: el suyo (self) y el de la colección. */
@Component
public class ClienteModelAssembler implements RepresentationModelAssembler<Cliente, EntityModel<Cliente>> {

    @Override
    public EntityModel<Cliente> toModel(Cliente entidad) {
        return EntityModel.of(entidad,
                linkTo(methodOn(ClienteController.class).buscarPorId(entidad.getId())).withSelfRel(),
                linkTo(methodOn(ClienteController.class).obtenerTodos()).withRel("clientes"));
    }
}
