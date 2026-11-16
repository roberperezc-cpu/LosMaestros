package cl.losmaestros.api.config;

import io.swagger.v3.oas.models.Components;
import io.swagger.v3.oas.models.OpenAPI;
import io.swagger.v3.oas.models.info.Contact;
import io.swagger.v3.oas.models.info.Info;
import io.swagger.v3.oas.models.security.SecurityRequirement;
import io.swagger.v3.oas.models.security.SecurityScheme;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;

/**
 * Documentación Swagger / OpenAPI. Se ve en http://localhost:8080/swagger-ui.html
 * El botón "Authorize" permite pegar el token JWT para probar los endpoints protegidos.
 */
@Configuration
public class OpenApiConfig {

    private static final String ESQUEMA_JWT = "bearerAuth";

    @Bean
    public OpenAPI openApi() {
        return new OpenAPI()
                .info(new Info()
                        .title("API Ferretería Los Maestros")
                        .version("2.0")
                        .description("API REST con Spring Boot y MySQL: productos, clientes, ventas y autenticación JWT. "
                                + "Las respuestas GET incluyen enlaces HATEOAS (_links).")
                        .contact(new Contact().name("Ferretería Los Maestros")))
                .addSecurityItem(new SecurityRequirement().addList(ESQUEMA_JWT))
                .components(new Components().addSecuritySchemes(ESQUEMA_JWT, new SecurityScheme()
                        .type(SecurityScheme.Type.HTTP)
                        .scheme("bearer")
                        .bearerFormat("JWT")
                        .description("Pega aquí el token que devuelve POST /api/auth/login (sin la palabra Bearer).")));
    }
}
