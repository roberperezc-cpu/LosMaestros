package cl.losmaestros.api.service;

import cl.losmaestros.api.dto.PedidoRequest;
import cl.losmaestros.api.dto.PedidoResponse;
import cl.losmaestros.api.exception.ConflictoException;
import cl.losmaestros.api.exception.RecursoNoEncontradoException;
import cl.losmaestros.api.exception.SolicitudInvalidaException;
import cl.losmaestros.api.model.Cliente;
import cl.losmaestros.api.model.Producto;
import cl.losmaestros.api.model.Venta;
import cl.losmaestros.api.repository.ClienteRepository;
import cl.losmaestros.api.repository.ProductoRepository;
import cl.losmaestros.api.repository.VentaRepository;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;
import java.time.format.DateTimeFormatter;
import java.util.ArrayList;
import java.util.LinkedHashMap;
import java.util.List;
import java.util.Map;
import java.util.concurrent.ThreadLocalRandom;

/** Confirma la compra del carrito: descuenta el stock y registra las ventas en la base de datos. */
@Service
public class PedidoService {

    private static final DateTimeFormatter FORMATO_NUMERO = DateTimeFormatter.ofPattern("yyMMdd-HHmmss");

    private final ProductoRepository productos;
    private final ClienteRepository clientes;
    private final VentaRepository ventas;

    public PedidoService(ProductoRepository productos, ClienteRepository clientes, VentaRepository ventas) {
        this.productos = productos;
        this.clientes = clientes;
        this.ventas = ventas;
    }

    /**
     * Es una sola transacción: si un producto no existe o no tiene stock suficiente, se cancela todo
     * y no queda ningún descuento de stock ni ninguna venta a medias.
     *
     * @param correoUsuario correo del usuario autenticado (sale del token JWT)
     */
    @Transactional
    public PedidoResponse confirmar(PedidoRequest datos, String correoUsuario) {
        Cliente cliente = clientes.findByCorreo(correoUsuario)
                .orElseThrow(() -> new SolicitudInvalidaException(
                        "Tu cuenta no tiene ficha de cliente: solo los clientes registrados pueden comprar."));

        boolean despacho = "despacho".equals(datos.tipoEntrega());
        String direccion = datos.direccionEntrega() == null ? "" : datos.direccionEntrega().trim();
        if (despacho && direccion.isEmpty()) {
            throw new SolicitudInvalidaException("Ingresa la dirección de despacho.");
        }

        // Si el mismo producto viene dos veces, se suman las cantidades.
        Map<String, Integer> cantidades = new LinkedHashMap<>();
        for (PedidoRequest.ItemPedido item : datos.items()) {
            cantidades.merge(item.productoId().trim(), item.cantidad(), Integer::sum);
        }

        String numeroPedido = generarNumeroPedido();
        LocalDateTime fecha = LocalDateTime.now();
        List<PedidoResponse.Linea> lineas = new ArrayList<>();
        int total = 0;

        for (Map.Entry<String, Integer> entrada : cantidades.entrySet()) {
            Producto producto = productos.findById(entrada.getKey())
                    .orElseThrow(() -> new RecursoNoEncontradoException("Producto no encontrado: " + entrada.getKey()));
            int cantidad = entrada.getValue();

            if (producto.getStock() < cantidad) {
                throw new ConflictoException("Stock insuficiente de \"" + producto.getNombre()
                        + "\": quedan " + producto.getStock() + " unidades.");
            }

            producto.setStock(producto.getStock() - cantidad);
            productos.save(producto);

            int subtotal = cantidad * producto.getPrecio();

            Venta venta = new Venta();
            venta.setFecha(fecha);
            venta.setClienteId(cliente.getId());
            venta.setProductoId(producto.getId());
            venta.setCantidad(cantidad);
            venta.setPrecioUnitario(producto.getPrecio());
            venta.setTotal(subtotal);
            venta.setTipoEntrega(datos.tipoEntrega());
            venta.setMetodoPago(datos.metodoPago());
            venta.setNumeroPedido(numeroPedido);
            venta.setDireccionEntrega(despacho ? direccion : null);
            ventas.save(venta);

            lineas.add(new PedidoResponse.Linea(producto.getId(), producto.getNombre(), cantidad,
                    producto.getPrecio(), subtotal));
            total += subtotal;
        }

        return new PedidoResponse(numeroPedido, fecha, total, datos.tipoEntrega(), datos.metodoPago(),
                despacho ? direccion : null, lineas);
    }

    /** Ejemplo: PED-261123-043015-47 (fecha, hora y dos dígitos al azar). Cabe en los 20 caracteres de la columna. */
    private String generarNumeroPedido() {
        int azar = ThreadLocalRandom.current().nextInt(10, 100);
        return "PED-" + LocalDateTime.now().format(FORMATO_NUMERO) + "-" + azar;
    }
}
