package cl.losmaestros.api.service;

import cl.losmaestros.api.dto.ClienteRequest;
import cl.losmaestros.api.exception.RecursoNoEncontradoException;
import cl.losmaestros.api.model.Cliente;
import cl.losmaestros.api.repository.ClienteRepository;
import org.springframework.data.domain.Sort;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

/**
 * Lógica de negocio de los clientes.
 * Si el RUT o el correo ya existen, MySQL lo rechaza (columnas únicas) y el
 * manejador de excepciones responde 409.
 */
@Service
public class ClienteService {

    private final ClienteRepository repositorio;

    public ClienteService(ClienteRepository repositorio) {
        this.repositorio = repositorio;
    }

    public List<Cliente> obtenerTodos() {
        return repositorio.findAll(Sort.by("id"));
    }

    public Cliente buscarPorId(Long id) {
        return repositorio.findById(id)
                .orElseThrow(() -> new RecursoNoEncontradoException("Cliente no encontrado: " + id));
    }

    @Transactional
    public Cliente guardar(ClienteRequest datos) {
        Cliente cliente = new Cliente();
        copiarDatos(cliente, datos);
        return repositorio.saveAndFlush(cliente);
    }

    @Transactional
    public Cliente actualizar(Long id, ClienteRequest datos) {
        Cliente cliente = buscarPorId(id);
        copiarDatos(cliente, datos);
        return repositorio.saveAndFlush(cliente);
    }

    @Transactional
    public void eliminar(Long id) {
        if (!repositorio.existsById(id)) {
            throw new RecursoNoEncontradoException("Cliente no encontrado: " + id);
        }
        repositorio.deleteById(id);
    }

    private void copiarDatos(Cliente cliente, ClienteRequest datos) {
        cliente.setRut(datos.rut().trim().toUpperCase());
        cliente.setNombre(datos.nombre().trim());
        cliente.setCorreo(datos.correo().trim().toLowerCase());
        cliente.setTelefono(datos.telefono().trim());
        cliente.setTipoCliente(datos.tipoCliente());
        cliente.setRegion(datos.region());
        cliente.setComuna(datos.comuna());
    }
}
