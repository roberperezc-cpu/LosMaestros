package cl.losmaestros.api.service;

import cl.losmaestros.api.dto.ProductoRequest;
import cl.losmaestros.api.exception.ConflictoException;
import cl.losmaestros.api.exception.RecursoNoEncontradoException;
import cl.losmaestros.api.model.Producto;
import cl.losmaestros.api.repository.ProductoRepository;
import org.springframework.data.domain.Sort;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

/** Lógica de negocio de los productos. El repositorio se inyecta por constructor. */
@Service
public class ProductoService {

    private final ProductoRepository repositorio;

    public ProductoService(ProductoRepository repositorio) {
        this.repositorio = repositorio;
    }

    /** Obtener todos los registros. */
    public List<Producto> obtenerTodos() {
        return repositorio.findAll(Sort.by("id"));
    }

    /** Buscar por ID (el SKU). */
    public Producto buscarPorId(String id) {
        return repositorio.findById(id)
                .orElseThrow(() -> new RecursoNoEncontradoException("Producto no encontrado: " + id));
    }

    /** Guardar / crear un registro nuevo. */
    @Transactional
    public Producto guardar(ProductoRequest datos) {
        if (repositorio.existsById(datos.id())) {
            throw new ConflictoException("Ya existe un producto con ese SKU.");
        }
        Producto producto = new Producto();
        producto.setId(datos.id());
        copiarDatos(producto, datos);
        return repositorio.save(producto);
    }

    /** Actualizar un registro existente (el SKU no cambia). */
    @Transactional
    public Producto actualizar(String id, ProductoRequest datos) {
        Producto producto = buscarPorId(id);
        copiarDatos(producto, datos);
        return repositorio.save(producto);
    }

    /** Eliminar por ID. */
    @Transactional
    public void eliminar(String id) {
        if (!repositorio.existsById(id)) {
            throw new RecursoNoEncontradoException("Producto no encontrado: " + id);
        }
        repositorio.deleteById(id);
    }

    private void copiarDatos(Producto producto, ProductoRequest datos) {
        producto.setNombre(datos.nombre().trim());
        producto.setCategoria(datos.categoria());
        producto.setCategoriaNombre(datos.categoriaNombre());
        producto.setPrecio(datos.precio());
        producto.setStock(datos.stock());
        producto.setStockMinimo(datos.stockMinimo());
        producto.setUbicacion(datos.ubicacion().trim());
        producto.setImagen(datos.imagen());
        producto.setEspecificaciones(datos.especificaciones());
    }
}
