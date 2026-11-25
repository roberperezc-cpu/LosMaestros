package cl.losmaestros.api.service;

import cl.losmaestros.api.dto.AuthResponse;
import cl.losmaestros.api.dto.LoginRequest;
import cl.losmaestros.api.dto.RegistroRequest;
import cl.losmaestros.api.exception.ConflictoException;
import cl.losmaestros.api.exception.CredencialesInvalidasException;
import cl.losmaestros.api.model.Cliente;
import cl.losmaestros.api.model.Usuario;
import cl.losmaestros.api.repository.ClienteRepository;
import cl.losmaestros.api.repository.UsuarioRepository;
import cl.losmaestros.api.security.JwtService;
import cl.losmaestros.api.util.Rut;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

/** Inicio de sesión y registro de usuarios. */
@Service
public class AuthService {

    private final UsuarioRepository usuarios;
    private final ClienteRepository clientes;
    private final PasswordEncoder codificador;
    private final JwtService jwtService;

    public AuthService(UsuarioRepository usuarios, ClienteRepository clientes,
                       PasswordEncoder codificador, JwtService jwtService) {
        this.usuarios = usuarios;
        this.clientes = clientes;
        this.codificador = codificador;
        this.jwtService = jwtService;
    }

    /** Si el correo no existe o la contraseña no coincide, da el mismo error (no revela cuál falló). */
    public AuthResponse login(LoginRequest datos) {
        Usuario usuario = usuarios.findByCorreo(normalizar(datos.correo()))
                .filter(u -> codificador.matches(datos.password(), u.getPassword()))
                .orElseThrow(() -> new CredencialesInvalidasException("Correo o contraseña incorrectos."));

        // El administrador no tiene ficha de cliente: en ese caso el perfil va null.
        Cliente cliente = clientes.findByCorreo(usuario.getCorreo()).orElse(null);
        return respuesta(usuario, cliente);
    }

    /**
     * Crea la cuenta (usuario con rol USER y contraseña cifrada) y la ficha del cliente.
     * Es una sola transacción: si algo falla, no queda ninguna de las dos a medias.
     */
    @Transactional
    public AuthResponse registrar(RegistroRequest datos) {
        String correo = normalizar(datos.correo());
        String rut = Rut.normalizar(datos.rut());

        if (usuarios.existsByCorreo(correo) || clientes.existsByCorreo(correo)) {
            throw new ConflictoException("Ya existe una cuenta con ese correo.");
        }
        if (clientes.existsByRut(rut)) {
            throw new ConflictoException("Ya existe un cliente con ese RUT.");
        }

        Usuario usuario = new Usuario();
        usuario.setNombre(datos.nombre().trim());
        usuario.setCorreo(correo);
        usuario.setPassword(codificador.encode(datos.password())); // se guarda el hash, no la contraseña
        usuario.setRol("USER");
        usuario = usuarios.save(usuario);

        Cliente cliente = new Cliente();
        cliente.setRut(rut);
        cliente.setNombre(datos.nombre().trim());
        cliente.setCorreo(correo);
        cliente.setTelefono(datos.telefono().trim());
        cliente.setTipoCliente(datos.tipoCliente());
        cliente.setRegion(datos.region());
        cliente.setComuna(datos.comuna());
        cliente = clientes.saveAndFlush(cliente);

        return respuesta(usuario, cliente);
    }

    private String normalizar(String correo) {
        return correo.trim().toLowerCase();
    }

    private AuthResponse respuesta(Usuario usuario, Cliente cliente) {
        AuthResponse.ClienteInfo perfil = cliente == null ? null : new AuthResponse.ClienteInfo(
                cliente.getRut(), cliente.getTelefono(), cliente.getTipoCliente(),
                cliente.getRegion(), cliente.getComuna());

        return new AuthResponse(
                jwtService.generarToken(usuario),
                "Bearer",
                jwtService.getExpiracionMinutos(),
                new AuthResponse.UsuarioInfo(usuario.getId(), usuario.getNombre(), usuario.getCorreo(), usuario.getRol()),
                perfil);
    }
}
