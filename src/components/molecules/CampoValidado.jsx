import Form from 'react-bootstrap/Form'

// Campo de formulario con validación visual (React Bootstrap).
function CampoValidado({ id, label, error, ...props }) {
  return (
    <Form.Group className="form-group" controlId={id}>
      <Form.Label>{label}</Form.Label>
      <Form.Control isInvalid={Boolean(error)} {...props} />
      {error && <Form.Control.Feedback type="invalid">{error}</Form.Control.Feedback>}
    </Form.Group>
  )
}

export default CampoValidado
