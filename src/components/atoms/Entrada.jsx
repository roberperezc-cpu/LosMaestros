function Entrada({ id, type = 'text', ...resto }) {
  return <input id={id} type={type} {...resto} />
}

export default Entrada
