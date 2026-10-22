function Footer({ texto = 'Todos los derechos reservados.' }) {
  return (
    <footer className="main-footer">
      <div className="footer-container">
        <p>&copy; {new Date().getFullYear()} Ferretería Los Maestros. {texto}</p>
      </div>
    </footer>
  )
}

export default Footer
