package cl.losmaestros.api.util;

import cl.losmaestros.api.dto.ClienteRequest;
import cl.losmaestros.api.dto.ProductoRequest;
import cl.losmaestros.api.dto.RegistroRequest;
import cl.losmaestros.api.dto.VentaRequest;
import cl.losmaestros.api.model.Cliente;
import cl.losmaestros.api.model.Producto;
import cl.losmaestros.api.model.Usuario;
import net.datafaker.Faker;

import java.util.Locale;

/**
 * Genera datos de prueba aleatorios con DataFaker (nombres, precios, RUT, correos...).
 * Cada ejecución produce valores distintos, pero siempre válidos para las reglas de la API.
 */
public final class DatosPrueba {

    private static final Faker FAKER = new Faker(Locale.forLanguageTag("es"));

    private DatosPrueba() {
    }

    /** SKU con el formato AAA-AAA-000. */
    public static String sku() {
        return FAKER.letterify("???").toUpperCase() + "-" + FAKER.letterify("???").toUpperCase() + "-" + FAKER.numerify("###");
    }

    /** RUT con el formato 12.345.678-5 (el dígito verificador es aleatorio). */
    public static String rut() {
        String cuerpo = Integer.toString(FAKER.number().numberBetween(10_000_000, 25_000_000));
        String dv = FAKER.options().option("0", "1", "2", "3", "4", "5", "6", "7", "8", "9", "K");
        return cuerpo.substring(0, 2) + "." + cuerpo.substring(2, 5) + "." + cuerpo.substring(5) + "-" + dv;
    }

    public static String correo() {
        return "usuario" + FAKER.numerify("######") + "@losmaestros.cl";
    }

    public static String telefono() {
        return "+56 9 " + FAKER.numerify("####") + " " + FAKER.numerify("####");
    }

    // ---------- datos de entrada (lo que envía el front-end) ----------

    public static ProductoRequest productoRequest() {
        return new ProductoRequest(
                sku(),
                FAKER.commerce().productName(),
                "herramientas-man",
                "Herramientas Manuales",
                FAKER.number().numberBetween(1_000, 99_999),
                FAKER.number().numberBetween(0, 200),
                FAKER.number().numberBetween(1, 20),
                "Pasillo " + FAKER.letterify("?").toUpperCase() + " - Estante " + FAKER.numerify("#"),
                "generico.svg",
                null);
    }

    public static ClienteRequest clienteRequest() {
        return new ClienteRequest(
                rut(),
                FAKER.name().fullName(),
                correo(),
                telefono(),
                FAKER.options().option("particular", "contratista", "empresa"),
                "coquimbo",
                FAKER.address().cityName());
    }

    public static RegistroRequest registroRequest() {
        ClienteRequest datos = clienteRequest();
        return new RegistroRequest(
                datos.nombre(), datos.correo(), "Clave123", datos.rut(), datos.telefono(),
                datos.tipoCliente(), datos.region(), datos.comuna());
    }

    public static VentaRequest ventaRequest() {
        return new VentaRequest(
                Long.valueOf(FAKER.number().numberBetween(1, 50)),
                sku(),
                FAKER.number().numberBetween(1, 10),
                FAKER.number().numberBetween(500, 90_000),
                FAKER.options().option("retiro", "despacho"),
                FAKER.options().option("transferencia", "tarjeta", "efectivo"));
    }

    // ---------- entidades (lo que devuelve la base de datos) ----------

    public static Producto producto() {
        ProductoRequest datos = productoRequest();
        Producto p = new Producto();
        p.setId(datos.id());
        p.setNombre(datos.nombre());
        p.setCategoria(datos.categoria());
        p.setCategoriaNombre(datos.categoriaNombre());
        p.setPrecio(datos.precio());
        p.setStock(datos.stock());
        p.setStockMinimo(datos.stockMinimo());
        p.setUbicacion(datos.ubicacion());
        p.setImagen(datos.imagen());
        return p;
    }

    public static Cliente cliente() {
        ClienteRequest datos = clienteRequest();
        Cliente c = new Cliente();
        c.setId(Long.valueOf(FAKER.number().numberBetween(1, 1000)));
        c.setRut(datos.rut());
        c.setNombre(datos.nombre());
        c.setCorreo(datos.correo());
        c.setTelefono(datos.telefono());
        c.setTipoCliente(datos.tipoCliente());
        c.setRegion(datos.region());
        c.setComuna(datos.comuna());
        return c;
    }

    public static Usuario usuario(String rol, String passwordCifrada) {
        Usuario u = new Usuario();
        u.setId(Long.valueOf(FAKER.number().numberBetween(1, 1000)));
        u.setNombre(FAKER.name().fullName());
        u.setCorreo(correo());
        u.setPassword(passwordCifrada);
        u.setRol(rol);
        return u;
    }
}
