const VARIANTES = {
  primario: 'btn btn-primary',
  secundario: 'btn btn-secondary',
  pequeno: 'btn-sm',
}

function Boton({ variante = 'primario', bloque = false, type = 'button', onClick, children }) {
  const clases = [VARIANTES[variante], bloque ? 'btn-block' : ''].filter(Boolean).join(' ')

  return (
    <button type={type} className={clases} onClick={onClick}>
      {children}
    </button>
  )
}

export default Boton
