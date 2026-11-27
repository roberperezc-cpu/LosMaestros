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
import cl.losmaestros.api.util.DatosPrueba;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.ArgumentCaptor;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;

import java.util.List;
import java.util.Optional;

import static org.junit.jupiter.api.Assertions.assertEquals;
import static org.junit.jupiter.api.Assertions.assertNull;
import static org.junit.jupiter.api.Assertions.assertThrows;
import static org.junit.jupiter.api.Assertions.assertTrue;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.never;
import static org.mockito.Mockito.times;
import static org.mockito.Mockito.verify;
import static org.mockito.Mockito.when;

@ExtendWith(MockitoExtension.class)
class PedidoServiceTest {

    @Mock
    private ProductoRepository productos;

    @Mock
    private ClienteRepository clientes;

    @Mock
    private VentaRepository ventas;

    @InjectMocks
    private PedidoService servicio;

    private Producto producto(String sku, int precio, int stock) {
        Producto p = DatosPrueba.producto();
        p.setId(sku);
        p.setPrecio(precio);
        p.setStock(stock);
        return p;
    }

    private PedidoRequest pedido(String tipoEntrega, String direccion, PedidoRequest.ItemPedido... items) {
        return new PedidoRequest(tipoEntrega, "transferencia", direccion, List.of(items));
    }

    @Test
    void confirmarDescuentaElStockCreaUnaVentaPorProductoYCalculaElTotal() {
        // Arrange
        Cliente cliente = DatosPrueba.cliente();
        Producto cemento = producto("MAT-CEM-001", 4890, 10);
        Producto cable = producto("ELE-CAB-002", 32990, 5);
        when(clientes.findByCorreo(cliente.getCorreo())).thenReturn(Optional.of(cliente));
        when(productos.findById("MAT-CEM-001")).thenReturn(Optional.of(cemento));
        when(productos.findById("ELE-CAB-002")).thenReturn(Optional.of(cable));
        when(productos.save(any(Producto.class))).thenAnswer(llamada -> llamada.getArgument(0));
        when(ventas.save(any(Venta.class))).thenAnswer(llamada -> llamada.getArgument(0));
        PedidoRequest datos = pedido("retiro", null,
                new PedidoRequest.ItemPedido("MAT-CEM-001", 2),
                new PedidoRequest.ItemPedido("ELE-CAB-002", 1));

        // Act
        PedidoResponse respuesta = servicio.confirmar(datos, cliente.getCorreo());

        // Assert
        assertEquals(8, cemento.getStock());
        assertEquals(4, cable.getStock());
        assertEquals(4890 * 2 + 32990, respuesta.total());
        assertEquals(2, respuesta.lineas().size());
        assertTrue(respuesta.numeroPedido().startsWith("PED-"));

        ArgumentCaptor<Venta> capturaVentas = ArgumentCaptor.forClass(Venta.class);
        verify(ventas, times(2)).save(capturaVentas.capture());
        List<Venta> guardadas = capturaVentas.getAllValues();
        assertEquals(cliente.getId(), guardadas.get(0).getClienteId());
        assertEquals(respuesta.numeroPedido(), guardadas.get(0).getNumeroPedido());
        assertEquals(respuesta.numeroPedido(), guardadas.get(1).getNumeroPedido());
    }

    @Test
    void confirmarConStockInsuficienteLanzaConflictoYNoGuardaVentas() {
        // Arrange
        Cliente cliente = DatosPrueba.cliente();
        Producto taladro = producto("HER-TAL-042", 58990, 1);
        when(clientes.findByCorreo(cliente.getCorreo())).thenReturn(Optional.of(cliente));
        when(productos.findById("HER-TAL-042")).thenReturn(Optional.of(taladro));
        PedidoRequest datos = pedido("retiro", null, new PedidoRequest.ItemPedido("HER-TAL-042", 3));

        // Act + Assert
        assertThrows(ConflictoException.class, () -> servicio.confirmar(datos, cliente.getCorreo()));
        verify(ventas, never()).save(any(Venta.class));
        assertEquals(1, taladro.getStock());
    }

    @Test
    void confirmarConUnProductoInexistenteLanzaNoEncontrado() {
        // Arrange
        Cliente cliente = DatosPrueba.cliente();
        when(clientes.findByCorreo(cliente.getCorreo())).thenReturn(Optional.of(cliente));
        when(productos.findById("XXX-XXX-999")).thenReturn(Optional.empty());
        PedidoRequest datos = pedido("retiro", null, new PedidoRequest.ItemPedido("XXX-XXX-999", 1));

        // Act + Assert
        assertThrows(RecursoNoEncontradoException.class, () -> servicio.confirmar(datos, cliente.getCorreo()));
    }

    @Test
    void confirmarSinFichaDeClienteLanzaSolicitudInvalida() {
        // Arrange
        String correoAdmin = "admin@losmaestros.cl";
        when(clientes.findByCorreo(correoAdmin)).thenReturn(Optional.empty());
        PedidoRequest datos = pedido("retiro", null, new PedidoRequest.ItemPedido("MAT-CEM-001", 1));

        // Act + Assert
        assertThrows(SolicitudInvalidaException.class, () -> servicio.confirmar(datos, correoAdmin));
        verify(productos, never()).findById(any(String.class));
    }

    @Test
    void confirmarConDespachoSinDireccionLanzaSolicitudInvalida() {
        // Arrange
        Cliente cliente = DatosPrueba.cliente();
        when(clientes.findByCorreo(cliente.getCorreo())).thenReturn(Optional.of(cliente));
        PedidoRequest datos = pedido("despacho", "   ", new PedidoRequest.ItemPedido("MAT-CEM-001", 1));

        // Act + Assert
        assertThrows(SolicitudInvalidaException.class, () -> servicio.confirmar(datos, cliente.getCorreo()));
        verify(ventas, never()).save(any(Venta.class));
    }

    @Test
    void confirmarConDespachoGuardaLaDireccionYConRetiroNo() {
        // Arrange
        Cliente cliente = DatosPrueba.cliente();
        Producto cemento = producto("MAT-CEM-001", 4890, 10);
        when(clientes.findByCorreo(cliente.getCorreo())).thenReturn(Optional.of(cliente));
        when(productos.findById("MAT-CEM-001")).thenReturn(Optional.of(cemento));
        when(productos.save(any(Producto.class))).thenAnswer(llamada -> llamada.getArgument(0));
        when(ventas.save(any(Venta.class))).thenAnswer(llamada -> llamada.getArgument(0));

        // Act
        PedidoResponse conDespacho = servicio.confirmar(
                pedido("despacho", "  Av. del Mar 1234, La Serena ", new PedidoRequest.ItemPedido("MAT-CEM-001", 1)),
                cliente.getCorreo());
        PedidoResponse conRetiro = servicio.confirmar(
                pedido("retiro", "Esta dirección se ignora", new PedidoRequest.ItemPedido("MAT-CEM-001", 1)),
                cliente.getCorreo());

        // Assert
        assertEquals("Av. del Mar 1234, La Serena", conDespacho.direccionEntrega());
        assertNull(conRetiro.direccionEntrega());
    }

    @Test
    void confirmarSumaLasCantidadesDeUnProductoRepetido() {
        // Arrange
        Cliente cliente = DatosPrueba.cliente();
        Producto cemento = producto("MAT-CEM-001", 4890, 10);
        when(clientes.findByCorreo(cliente.getCorreo())).thenReturn(Optional.of(cliente));
        when(productos.findById("MAT-CEM-001")).thenReturn(Optional.of(cemento));
        when(productos.save(any(Producto.class))).thenAnswer(llamada -> llamada.getArgument(0));
        when(ventas.save(any(Venta.class))).thenAnswer(llamada -> llamada.getArgument(0));
        PedidoRequest datos = pedido("retiro", null,
                new PedidoRequest.ItemPedido("MAT-CEM-001", 2),
                new PedidoRequest.ItemPedido("MAT-CEM-001", 3));

        // Act
        PedidoResponse respuesta = servicio.confirmar(datos, cliente.getCorreo());

        // Assert
        assertEquals(5, respuesta.lineas().get(0).cantidad());
        assertEquals(5, cemento.getStock());
        verify(ventas, times(1)).save(any(Venta.class));
    }
}
