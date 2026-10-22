function BloqueInfo({ titulo, lineas }) {
  return (
    <div>
      <h4>{titulo}</h4>
      {lineas.map((linea) => (
        <p key={linea}>{linea}</p>
      ))}
    </div>
  )
}

export default BloqueInfo
