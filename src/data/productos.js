import imgCemento from '../assets/img/Cemento1.jpg'
import imgTaladro from '../assets/img/taladro.jpg'
import imgTubo from '../assets/img/tubo.jpg'
import imgCable from '../assets/img/cable.jpg'

// Base de datos local de productos (antes en js/app.js)
const productos = [
  {
    id: 'MAT-CEM-001',
    nombre: 'Saco de Cemento Melón 25kg',
    categoria: 'construccion',
    categoriaNombre: 'Construcción',
    precio: 4890,
    stock: 142,
    stockMinimo: 20,
    ubicacion: 'Bodega Patio - Sector A',
    imagen: imgCemento,
    especificaciones: {
      Marca: 'Melón',
      Peso: '25 kg',
      Uso: 'Estructuras, pavimentos y albañilería general',
      Rendimiento: 'Según dosificación de mezcla',
    },
  },
  {
    id: 'HER-TAL-042',
    nombre: 'Taladro Percutor 710W Makita',
    categoria: 'herramientas-elec',
    categoriaNombre: 'Herramientas Eléctricas',
    precio: 58990,
    stock: 3,
    stockMinimo: 5,
    ubicacion: 'Pasillo A - Estante 4',
    imagen: imgTaladro,
    especificaciones: {
      Marca: 'Makita',
      Potencia: '710W',
      Velocidad: '0 - 3.200 RPM',
      'Capacidad Hormigón': '16 mm',
      Garantía: '12 meses oficial',
    },
  },
  {
    id: 'GAS-PVC-110',
    nombre: 'Tubo PVC Sanitario 110mm x 3m',
    categoria: 'gasfiteria',
    categoriaNombre: 'Gasfitería',
    precio: 8490,
    stock: 0,
    stockMinimo: 10,
    ubicacion: 'Bodega Exterior - Estante C',
    imagen: imgTubo,
    especificaciones: {
      Diámetro: '110 mm',
      Largo: '3 metros',
      Material: 'PVC Rígido Sanitario',
      Norma: 'NCh397',
    },
  },
  {
    id: 'ELE-CAB-002',
    nombre: 'Cable Eléctrico 2.5mm Flex (Rollo 100m)',
    categoria: 'electricidad',
    categoriaNombre: 'Electricidad',
    precio: 32990,
    stock: 18,
    stockMinimo: 8,
    ubicacion: 'Pasillo B - Estante 2',
    imagen: imgCable,
    especificaciones: {
      Sección: '2.5 mm²',
      Largo: '100 metros',
      Aislamiento: 'PVC 70°C',
      Uso: 'Instalaciones domiciliarias e industriales',
    },
  },
]

export default productos
