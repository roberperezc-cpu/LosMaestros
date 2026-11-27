package cl.losmaestros.api.exception;

/** La petición es correcta en su formato, pero no se puede atender (HTTP 400). */
public class SolicitudInvalidaException extends RuntimeException {

    public SolicitudInvalidaException(String mensaje) {
        super(mensaje);
    }
}
