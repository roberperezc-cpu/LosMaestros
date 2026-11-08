package cl.losmaestros.api.model;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.Id;
import jakarta.persistence.Table;

/**
 * Producto del catálogo. Entidad independiente: no tiene relaciones con otras entidades.
 * Cada atributo se guarda como una columna de la tabla "productos".
 */
@Entity
@Table(name = "productos")
public class Producto {

    /** SKU, por ejemplo HER-TAL-042. Se asigna a mano (no es autoincremental). */
    @Id
    @Column(length = 20)
    private String id;

    @Column(nullable = false, length = 120)
    private String nombre;

    @Column(nullable = false, length = 40)
    private String categoria;

    @Column(name = "categoria_nombre", nullable = false, length = 60)
    private String categoriaNombre;

    @Column(nullable = false)
    private Integer precio;

    @Column(nullable = false)
    private Integer stock;

    @Column(name = "stock_minimo", nullable = false)
    private Integer stockMinimo;

    @Column(nullable = false, length = 80)
    private String ubicacion;

    /** Nombre del archivo de imagen (ej: taladro.jpg). Puede ser null. */
    @Column(length = 255)
    private String imagen;

    /** Especificaciones técnicas como texto JSON, ej: {"Marca":"Makita"}. Puede ser null. */
    @Column(length = 1000)
    private String especificaciones;

    public String getId() { return id; }
    public void setId(String id) { this.id = id; }

    public String getNombre() { return nombre; }
    public void setNombre(String nombre) { this.nombre = nombre; }

    public String getCategoria() { return categoria; }
    public void setCategoria(String categoria) { this.categoria = categoria; }

    public String getCategoriaNombre() { return categoriaNombre; }
    public void setCategoriaNombre(String categoriaNombre) { this.categoriaNombre = categoriaNombre; }

    public Integer getPrecio() { return precio; }
    public void setPrecio(Integer precio) { this.precio = precio; }

    public Integer getStock() { return stock; }
    public void setStock(Integer stock) { this.stock = stock; }

    public Integer getStockMinimo() { return stockMinimo; }
    public void setStockMinimo(Integer stockMinimo) { this.stockMinimo = stockMinimo; }

    public String getUbicacion() { return ubicacion; }
    public void setUbicacion(String ubicacion) { this.ubicacion = ubicacion; }

    public String getImagen() { return imagen; }
    public void setImagen(String imagen) { this.imagen = imagen; }

    public String getEspecificaciones() { return especificaciones; }
    public void setEspecificaciones(String especificaciones) { this.especificaciones = especificaciones; }
}
