package cl.losmaestros.api.service;

import cl.losmaestros.api.dto.VentaRequest;
import cl.losmaestros.api.exception.RecursoNoEncontradoException;
import cl.losmaestros.api.model.Venta;
import cl.losmaestros.api.repository.VentaRepository;
import org.springframework.data.domain.Sort;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;
import java.util.List;

/** Lógica de negocio de las ventas: el servidor pone la fecha y calcula el total. */
@Service
public class VentaService {

    private final VentaRepository repositorio;

    public VentaService(VentaRepository repositorio) {
        this.repositorio = repositorio;
    }

    public List<Venta> obtenerTodos() {
        return repositorio.findAll(Sort.by("id"));
    }

    public Venta buscarPorId(Long id) {
        return repositorio.findById(id)
                .orElseThrow(() -> new RecursoNoEncontradoException("Venta no encontrada: " + id));
    }

    @Transactional
    public Venta guardar(VentaRequest datos) {
        Venta venta = new Venta();
        venta.setFecha(LocalDateTime.now());
        copiarDatos(venta, datos);
        return repositorio.save(venta);
    }

    @Transactional
    public Venta actualizar(Long id, VentaRequest datos) {
        Venta venta = buscarPorId(id); // la fecha original se conserva
        copiarDatos(venta, datos);
        return repositorio.save(venta);
    }

    @Transactional
    public void eliminar(Long id) {
        if (!repositorio.existsById(id)) {
            throw new RecursoNoEncontradoException("Venta no encontrada: " + id);
        }
        repositorio.deleteById(id);
    }

    private void copiarDatos(Venta venta, VentaRequest datos) {
        venta.setClienteId(datos.clienteId());
        venta.setProductoId(datos.productoId().trim());
        venta.setCantidad(datos.cantidad());
        venta.setPrecioUnitario(datos.precioUnitario());
        venta.setTotal(datos.cantidad() * datos.precioUnitario());
        venta.setTipoEntrega(datos.tipoEntrega());
        venta.setMetodoPago(datos.metodoPago());
    }
}
