import { describe, it, expect, beforeEach } from 'vitest'
import { validarRut, validarTelefono, validarRegistro } from './validaciones'
import { registrarUsuario, obtenerUsuariosRegistrados, formatearRut } from './usuarios'
import { autenticar } from './sesion'

const datosValidos = {
  nombre: 'Juan Pérez',
  rut: '9.876.543-3',
  correo: 'juan@correo.cl',
  telefono: '+56 9 1234 5678',
  tipoCliente: 'particular',
  region: 'coquimbo',
  comuna: 'La Serena',
  password: 'Clave123',
  confirmarPassword: 'Clave123',
  terminos: true,
}

describe('validarRut', () => {
  it('acepta un RUT válido con puntos y guion', () => {
    // Arrange
    const rut = '12.345.678-5'

    // Act
    const resultado = validarRut(rut)

    // Assert
    expect(resultado).toBe('')
  })

  it('rechaza un RUT con dígito verificador incorrecto', () => {
    // Arrange
    const rut = '12.345.678-9'

    // Act
    const resultado = validarRut(rut)

    // Assert
    expect(resultado).toMatch(/dígito verificador/i)
  })

  it('rechaza un RUT con formato inválido', () => {
    // Arrange
    const rut = 'abc'

    // Act
    const resultado = validarRut(rut)

    // Assert
    expect(resultado).toMatch(/formato/i)
  })
})

describe('validarTelefono', () => {
  it('acepta un celular chileno con o sin +56', () => {
    // Arrange + Act
    const conPrefijo = validarTelefono('+56 9 1234 5678')
    const sinPrefijo = validarTelefono('912345678')

    // Assert
    expect(conPrefijo).toBe('')
    expect(sinPrefijo).toBe('')
  })

  it('rechaza un número que no es celular chileno', () => {
    // Arrange
    const telefono = '12345'

    // Act
    const resultado = validarTelefono(telefono)

    // Assert
    expect(resultado).toMatch(/celular chileno/i)
  })
})

describe('validarRegistro', () => {
  it('acepta datos correctos', () => {
    // Arrange
    const datos = { ...datosValidos }

    // Act
    const errores = validarRegistro(datos, [])

    // Assert
    expect(errores).toEqual({})
  })

  it('detecta contraseñas que no coinciden', () => {
    // Arrange
    const datos = { ...datosValidos, confirmarPassword: 'Otra123' }

    // Act
    const errores = validarRegistro(datos, [])

    // Assert
    expect(errores.confirmarPassword).toBe('Las contraseñas no coinciden.')
  })

  it('exige letras y números en la contraseña', () => {
    // Arrange
    const datos = { ...datosValidos, password: 'sololetras', confirmarPassword: 'sololetras' }

    // Act
    const errores = validarRegistro(datos, [])

    // Assert
    expect(errores.password).toMatch(/letras y números/i)
  })

  it('detecta correo y RUT ya registrados', () => {
    // Arrange
    const existentes = [{ correo: 'juan@correo.cl', rut: '9.876.543-3' }]

    // Act
    const errores = validarRegistro(datosValidos, existentes)

    // Assert
    expect(errores.correo).toBe('Ya existe una cuenta con ese correo.')
    expect(errores.rut).toBe('Ya existe una cuenta con ese RUT.')
  })

  it('exige aceptar los términos', () => {
    // Arrange
    const datos = { ...datosValidos, terminos: false }

    // Act
    const errores = validarRegistro(datos, [])

    // Assert
    expect(errores.terminos).toBeDefined()
  })
})

describe('registrarUsuario', () => {
  beforeEach(() => {
    localStorage.clear()
  })

  it('guarda el usuario, formatea el RUT y no devuelve la contraseña', () => {
    // Arrange
    const datos = { ...datosValidos, rut: '98765433' }

    // Act
    const usuario = registrarUsuario(datos)

    // Assert
    expect(usuario.rut).toBe('9.876.543-3')
    expect(usuario).not.toHaveProperty('password')
    expect(obtenerUsuariosRegistrados()).toHaveLength(1)
  })

  it('el usuario registrado puede iniciar sesión', () => {
    // Arrange
    registrarUsuario(datosValidos)

    // Act
    const sesion = autenticar('JUAN@correo.cl', 'Clave123')

    // Assert
    expect(sesion).toMatchObject({ nombre: 'Juan Pérez', rol: 'cliente' })
  })
})

describe('formatearRut', () => {
  it('agrega puntos y guion', () => {
    // Arrange
    const rut = '123456785'

    // Act
    const resultado = formatearRut(rut)

    // Assert
    expect(resultado).toBe('12.345.678-5')
  })
})
