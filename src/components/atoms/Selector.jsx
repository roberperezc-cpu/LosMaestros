function Selector({ id, children, ...resto }) {
  return (
    <select id={id} {...resto}>
      {children}
    </select>
  )
}

export default Selector
