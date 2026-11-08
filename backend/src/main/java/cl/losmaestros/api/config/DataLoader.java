package cl.losmaestros.api.config;

import cl.losmaestros.api.model.Cliente;
import cl.losmaestros.api.model.Producto;
import cl.losmaestros.api.repository.ClienteRepository;
import cl.losmaestros.api.repository.ProductoRepository;
import org.springframework.boot.CommandLineRunner;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;

import java.util.List;

/**
 * Al arrancar, si las tablas están vacías, carga datos de ejemplo:
 * los 4 productos del sitio y 2 clientes.
 */
@Configuration
public class DataLoader {

    @Bean
    CommandLineRunner cargarDatosIniciales(ProductoRepository productos, ClienteRepository clientes) {
        return args -> {
            if (productos.count() == 0) {
                productos.saveAll(List.of(
                        producto("MAT-CEM-001", "Saco de Cemento Melón 25kg", "construccion", "Construcción",
                                4890, 142, 20, "Bodega Patio - Sector A", "Cemento1.jpg",
                                "{\"Marca\":\"Melón\",\"Peso\":\"25 kg\",\"Uso\":\"Estructuras, pavimentos y albañilería general\",\"Rendimiento\":\"Según dosificación de mezcla\"}"),
                        producto("HER-TAL-042", "Taladro Percutor 710W Makita", "herramientas-elec", "Herramientas Eléctricas",
                                58990, 3, 5, "Pasillo A - Estante 4", "taladro.jpg",
                                "{\"Marca\":\"Makita\",\"Potencia\":\"710W\",\"Velocidad\":\"0 - 3.200 RPM\",\"Capacidad Hormigón\":\"16 mm\",\"Garantía\":\"12 meses oficial\"}"),
                        producto("GAS-PVC-110", "Tubo PVC Sanitario 110mm x 3m", "gasfiteria", "Gasfitería",
                                8490, 0, 10, "Bodega Exterior - Estante C", "tubo.jpg",
                                "{\"Diámetro\":\"110 mm\",\"Largo\":\"3 metros\",\"Material\":\"PVC Rígido Sanitario\",\"Norma\":\"NCh397\"}"),
                        producto("ELE-CAB-002", "Cable Eléctrico 2.5mm Flex (Rollo 100m)", "electricidad", "Electricidad",
                                32990, 18, 8, "Pasillo B - Estante 2", "cable.jpg",
                                "{\"Sección\":\"2.5 mm²\",\"Largo\":\"100 metros\",\"Aislamiento\":\"PVC 70°C\",\"Uso\":\"Instalaciones domiciliarias e industriales\"}")
                ));
            }

            if (clientes.count() == 0) {
                clientes.saveAll(List.of(
                        cliente("12.345.678-5", "Constructora Elqui", "contratista@losmaestros.cl",
                                "+56 9 8765 4321", "contratista", "coquimbo", "Coquimbo"),
                        cliente("9.876.543-3", "Juan Pérez", "juan@correo.cl",
                                "+56 9 1234 5678", "particular", "coquimbo", "La Serena")
                ));
            }
        };
    }

    private static Producto producto(String id, String nombre, String categoria, String categoriaNombre,
                                     int precio, int stock, int stockMinimo, String ubicacion,
                                     String imagen, String especificaciones) {
        Producto p = new Producto();
        p.setId(id);
        p.setNombre(nombre);
        p.setCategoria(categoria);
        p.setCategoriaNombre(categoriaNombre);
        p.setPrecio(precio);
        p.setStock(stock);
        p.setStockMinimo(stockMinimo);
        p.setUbicacion(ubicacion);
        p.setImagen(imagen);
        p.setEspecificaciones(especificaciones);
        return p;
    }

    private static Cliente cliente(String rut, String nombre, String correo, String telefono,
                                   String tipoCliente, String region, String comuna) {
        Cliente c = new Cliente();
        c.setRut(rut);
        c.setNombre(nombre);
        c.setCorreo(correo);
        c.setTelefono(telefono);
        c.setTipoCliente(tipoCliente);
        c.setRegion(region);
        c.setComuna(comuna);
        return c;
    }
}
