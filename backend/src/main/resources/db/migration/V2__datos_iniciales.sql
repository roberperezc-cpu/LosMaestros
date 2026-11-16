-- V2: datos de ejemplo (los 4 productos del sitio y 2 clientes).

INSERT INTO productos (id, nombre, categoria, categoria_nombre, precio, stock, stock_minimo, ubicacion, imagen, especificaciones) VALUES
('MAT-CEM-001', 'Saco de Cemento Melón 25kg', 'construccion', 'Construcción', 4890, 142, 20, 'Bodega Patio - Sector A', 'Cemento1.jpg',
 '{"Marca":"Melón","Peso":"25 kg","Uso":"Estructuras, pavimentos y albañilería general","Rendimiento":"Según dosificación de mezcla"}'),
('HER-TAL-042', 'Taladro Percutor 710W Makita', 'herramientas-elec', 'Herramientas Eléctricas', 58990, 3, 5, 'Pasillo A - Estante 4', 'taladro.jpg',
 '{"Marca":"Makita","Potencia":"710W","Velocidad":"0 - 3.200 RPM","Capacidad Hormigón":"16 mm","Garantía":"12 meses oficial"}'),
('GAS-PVC-110', 'Tubo PVC Sanitario 110mm x 3m', 'gasfiteria', 'Gasfitería', 8490, 0, 10, 'Bodega Exterior - Estante C', 'tubo.jpg',
 '{"Diámetro":"110 mm","Largo":"3 metros","Material":"PVC Rígido Sanitario","Norma":"NCh397"}'),
('ELE-CAB-002', 'Cable Eléctrico 2.5mm Flex (Rollo 100m)', 'electricidad', 'Electricidad', 32990, 18, 8, 'Pasillo B - Estante 2', 'cable.jpg',
 '{"Sección":"2.5 mm²","Largo":"100 metros","Aislamiento":"PVC 70°C","Uso":"Instalaciones domiciliarias e industriales"}');

INSERT INTO clientes (rut, nombre, correo, telefono, tipo_cliente, region, comuna) VALUES
('12.345.678-5', 'Constructora Elqui', 'contratista@losmaestros.cl', '+56 9 8765 4321', 'contratista', 'coquimbo', 'Coquimbo'),
('9.876.543-3', 'Juan Pérez', 'juan@correo.cl', '+56 9 1234 5678', 'particular', 'coquimbo', 'La Serena');
