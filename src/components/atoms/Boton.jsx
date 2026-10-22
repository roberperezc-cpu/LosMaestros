const VARIANTES = {
  primario: 'btn btn-primary',
  secundario: 'btn btn-secondary',
  pequeno: 'btn-sm',
}

function Boton({
  variante = 'primario',
  bloque = false,
  type = 'button',
  onClick,
  className = '',
  children,
  ...resto
}) {
  const clases = [VARIANTES[variante], bloque ? 'btn-block' : '', className]
    .filter(Boolean)
    .join(' ')

  return (
    <button type={type} className={clases} onClick={onClick} {...resto}>
      {children}
    </button>
  )
}

export default Boton
