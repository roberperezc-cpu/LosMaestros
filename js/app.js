// ==========================================
// 1. BASE DE DATOS LOCAL DE PRODUCTOS
// ==========================================
const productos = [
  {
    id: "MAT-CEM-001",
    nombre: "Saco de Cemento Melón 25kg",
    categoria: "construccion",
    categoriaNombre: "Construcción",
    precio: 4890,
    stock: 142,
    stockMinimo: 20,
    ubicacion: "Bodega Patio - Sector A",
    imagen: "img/Cemento1.jpg",
    especificaciones: {
      "Marca": "Melón",
      "Peso": "25 kg",
      "Uso": "Estructuras, pavimentos y albañilería general",
      "Rendimiento": "Según dosificación de mezcla"
    }
  },
  {
    id: "HER-TAL-042",
    nombre: "Taladro Percutor 710W Makita",
    categoria: "herramientas-elec",
    categoriaNombre: "Herramientas Eléctricas",
    precio: 58990,
    stock: 3,
    stockMinimo: 5,
    ubicacion: "Pasillo A - Estante 4",
    imagen: "img/taladro.jpg",
    especificaciones: {
      "Marca": "Makita",
      "Potencia": "710W",
      "Velocidad": "0 - 3.200 RPM",
      "Capacidad Hormigón": "16 mm",
      "Garantía": "12 meses oficial"
    }
  },
  {
    id: "GAS-PVC-110",
    nombre: "Tubo PVC Sanitario 110mm x 3m",
    categoria: "gasfiteria",
    categoriaNombre: "Gasfitería",
    precio: 8490,
    stock: 0,
    stockMinimo: 10,
    ubicacion: "Bodega Exterior - Estante C",
    imagen: "img/tubo.jpg",
    especificaciones: {
      "Diámetro": "110 mm",
      "Largo": "3 metros",
      "Material": "PVC Rígido Sanitario",
      "Norma": "NCh397"
    }
  },
  {
    id: "ELE-CAB-002",
    nombre: "Cable Eléctrico 2.5mm Flex (Rollo 100m)",
    categoria: "electricidad",
    categoriaNombre: "Electricidad",
    precio: 32990,
    stock: 18,
    stockMinimo: 8,
    ubicacion: "Pasillo B - Estante 2",
    imagen: "img/cable.jpg",
    especificaciones: {
      "Sección": "2.5 mm²",
      "Largo": "100 metros",
      "Aislamiento": "PVC 70°C",
      "Uso": "Instalaciones domiciliarias e industriales"
    }
  }
];

// Carrito para el POS
let carritoPOS = [];

// ==========================================
// 2. LÓGICA DE CATÁLOGO (`catalogo.html`)
// ==========================================
function cargarCatálogo() {
  const productGrid = document.getElementById("product-grid");
  const searchInput = document.getElementById("search-input");
  const categoryFilter = document.getElementById("category-filter");

  if (!productGrid) return; // Si no estamos en catalogo.html, no ejecutar

  function renderizarProductos(lista) {
    productGrid.innerHTML = "";

    if (lista.length === 0) {
      productGrid.innerHTML = `<p style="grid-column: 1/-1; text-align: center; color: var(--text-muted);">No se encontraron productos que coincidan con la búsqueda.</p>`;
      return;
    }

    lista.forEach(prod => {
      let badgeClass = "stock-ok";
      let badgeText = "En Stock";

      if (prod.stock === 0) {
        badgeClass = "stock-out";
        badgeText = "Agotado";
      } else if (prod.stock <= prod.stockMinimo) {
        badgeClass = "stock-low";
        badgeText = "Bajo Stock";
      }

      const cardHTML = `
        <article class="product-card">
          <div class="badge ${badgeClass}">${badgeText}</div>
          <a href="detalle-producto.html?id=${prod.id}">
            <img src="${prod.imagen}" alt="${prod.nombre}">
          </a>
          <div class="product-info">
            <span class="category">${prod.categoriaNombre}</span>
            <h4><a href="detalle-producto.html?id=${prod.id}" style="text-decoration:none; color:inherit;">${prod.nombre}</a></h4>
            <p class="sku">SKU: ${prod.id}</p>
            <p class="price">$${prod.precio.toLocaleString("es-CL")} CLP</p>
            <p class="stock-count">Disponible: <strong>${prod.stock} unidades</strong></p>
            <a href="detalle-producto.html?id=${prod.id}" class="btn-sm" style="display:block; margin-top:0.5rem; text-align:center; text-decoration:none;">Ver Detalle</a>
          </div>
        </article>
      `;

      productGrid.insertAdjacentHTML("beforeend", cardHTML);
    });
  }

  function filtrar() {
    const texto = searchInput ? searchInput.value.toLowerCase().trim() : "";
    const categoria = categoryFilter ? categoryFilter.value : "";

    const resultados = productos.filter(p => {
      const coincideTexto = p.nombre.toLowerCase().includes(texto) || p.id.toLowerCase().includes(texto);
      const coincideCategoria = categoria === "" || p.categoria === categoria;
      return coincideTexto && coincideCategoria;
    });

    renderizarProductos(resultados);
  }

  if (searchInput) searchInput.addEventListener("input", filtrar);
  if (categoryFilter) categoryFilter.addEventListener("change", filtrar);

  // Carga inicial
  renderizarProductos(productos);
}

// ==========================================
// 3. LÓGICA DE DETALLE DE PRODUCTO (`detalle-producto.html`)
// ==========================================
function cargarDetalleProducto() {
  const container = document.getElementById("product-detail-container");
  if (!container) return; // Si no estamos en detalle-producto.html, salir

  // Obtener ID desde la URL (?id=HER-TAL-042)
  const urlParams = new URLSearchParams(window.location.search);
  const idProducto = urlParams.get("id") || "MAT-CEM-001"; // Default si entra directo

  const prod = productos.find(p => p.id === idProducto);

  if (!prod) {
    container.innerHTML = `<h2>Producto no encontrado</h2><p><a href="catalogo.html" class="btn-back">&larr; Volver al catálogo</a></p>`;
    return;
  }

  // Actualizar elementos HTML
  document.getElementById("detail-image").src = prod.imagen;
  document.getElementById("detail-image").alt = prod.nombre;
  document.getElementById("detail-category").textContent = prod.categoriaNombre;
  document.getElementById("detail-title").textContent = prod.nombre;
  document.getElementById("detail-sku").textContent = `SKU: ${prod.id}`;
  document.getElementById("detail-price").textContent = `$${prod.precio.toLocaleString("es-CL")} CLP`;

  const stockText = document.getElementById("detail-stock-text");
  const stockBox = document.getElementById("detail-stock-box");
  const locationText = document.getElementById("detail-location");

  locationText.textContent = `Ubicación en Bodega: ${prod.ubicacion}`;

  if (prod.stock === 0) {
    stockBox.className = "stock-status-box";
    stockBox.style.backgroundColor = "#ffebee";
    stockBox.style.borderLeft = "4px solid var(--stock-out)";
    stockText.textContent = "Agotado - Sin stock disponible";
  } else if (prod.stock <= prod.stockMinimo) {
    stockBox.className = "stock-status-box stock-low-box";
    stockText.textContent = `Stock Disponible: ${prod.stock} unidades (Bajo Stock)`;
  } else {
    stockBox.className = "stock-status-box";
    stockBox.style.backgroundColor = "#e8f5e9";
    stockBox.style.borderLeft = "4px solid var(--stock-ok)";
    stockText.textContent = `Stock Disponible: ${prod.stock} unidades en bodega`;
  }

  // Renderizar especificaciones técnicas
  const specsList = document.getElementById("detail-specs");
  specsList.innerHTML = "";
  for (const [clave, valor] of Object.entries(prod.especificaciones)) {
    specsList.insertAdjacentHTML("beforeend", `<li><strong>${clave}:</strong> ${valor}</li>`);
  }
}

// ==========================================
// 4. LÓGICA DE PUNTO DE VENTA MESÓN (`pos.html`)
// ==========================================
function cargarPOS() {
  const posTableBody = document.querySelector(".pos-products tbody");
  const cartItemsContainer = document.querySelector(".cart-items");
  if (!posTableBody || !cartItemsContainer) return;

  function renderizarTablaProductosPOS() {
    posTableBody.innerHTML = "";
    productos.forEach(prod => {
      const row = `
        <tr>
          <td>${prod.id}</td>
          <td>${prod.nombre}</td>
          <td>$${prod.precio.toLocaleString("es-CL")}</td>
          <td>${prod.stock}</td>
          <td><button class="btn-sm" onclick="agregarAlCarritoPOS('${prod.id}')">+ Agregar</button></td>
        </tr>
      `;
      posTableBody.insertAdjacentHTML("beforeend", row);
    });
  }

  window.agregarAlCarritoPOS = function(id) {
    const prod = productos.find(p => p.id === id);
    if (!prod || prod.stock === 0) {
      alert("Producto sin stock disponible");
      return;
    }

    const itemEnCarrito = carritoPOS.find(item => item.id === id);
    if (itemEnCarrito) {
      if (itemEnCarrito.cantidad < prod.stock) {
        itemEnCarrito.cantidad++;
      } else {
        alert("No hay suficiente stock disponible");
      }
    } else {
      carritoPOS.push({ ...prod, cantidad: 1 });
    }

    actualizarCarritoPOS();
  };

  function actualizarCarritoPOS() {
    cartItemsContainer.innerHTML = "";
    let total = 0;

    if (carritoPOS.length === 0) {
      cartItemsContainer.innerHTML = `<p style="color:var(--text-muted); padding:1rem 0;">No hay productos en la venta.</p>`;
    } else {
      carritoPOS.forEach(item => {
        const subtotalItem = item.precio * item.cantidad;
        total += subtotalItem;

        const cartItemHTML = `
          <div class="cart-item" style="display:flex; justify-content:space-between; margin-bottom:0.5rem; padding-bottom:0.5rem; border-bottom:1px solid #eee;">
            <span>${item.nombre} x ${item.cantidad}</span>
            <strong>$${subtotalItem.toLocaleString("es-CL")}</strong>
          </div>
        `;
        cartItemsContainer.insertAdjacentHTML("beforeend", cartItemHTML);
      });
    }

    const neto = Math.round(total / 1.19);
    const iva = total - neto;

    const totalsContainer = document.querySelector(".cart-totals");
    if (totalsContainer) {
      totalsContainer.innerHTML = `
        <p>Subtotal Neto: <span>$${neto.toLocaleString("es-CL")} CLP</span></p>
        <p>19% IVA: <span>$${iva.toLocaleString("es-CL")} CLP</span></p>
        <h3>Total a Pagar: <span>$${total.toLocaleString("es-CL")} CLP</span></h3>
      </h3>`;
    }
  }

  renderizarTablaProductosPOS();
  actualizarCarritoPOS();
}

// ==========================================
// 5. INICIALIZACIÓN
// ==========================================
document.addEventListener("DOMContentLoaded", () => {
  cargarCatálogo();
  cargarDetalleProducto();
  cargarPOS();
});