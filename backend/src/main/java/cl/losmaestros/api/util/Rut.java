package cl.losmaestros.api.util;

/** Utilidades para el RUT chileno. */
public final class Rut {

    private Rut() {
    }

    /**
     * Deja el RUT siempre con el mismo formato: 12.345.678-5.
     * Así "12345678-5", "12.345.678-5" y "12345678-5 " cuentan como el mismo RUT
     * (y el RUT único de la tabla clientes no se puede repetir con otro formato).
     */
    public static String normalizar(String rut) {
        String limpio = rut.replace(".", "").replace("-", "").replace(" ", "").toUpperCase();
        String cuerpo = limpio.substring(0, limpio.length() - 1);
        String digito = limpio.substring(limpio.length() - 1);

        StringBuilder conPuntos = new StringBuilder();
        int contador = 0;
        for (int i = cuerpo.length() - 1; i >= 0; i--) {
            conPuntos.insert(0, cuerpo.charAt(i));
            contador++;
            if (contador % 3 == 0 && i > 0) {
                conPuntos.insert(0, '.');
            }
        }
        return conPuntos + "-" + digito;
    }
}
