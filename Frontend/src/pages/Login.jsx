import Container from 'react-bootstrap/Container';
import Button from 'react-bootstrap/Button';
import Form from 'react-bootstrap/Form';

export default function Login() {
  function handleSubmit(e) {
    e.preventDefault();

    // Simulate form submission without authentication
    const formData = new FormData(e.target);
    const email = formData.get('email');
    const password = formData.get('lozinka');
    console.log('Email:', email);
    console.log('Password:', password);

    // You can add your own logic here for handling form submission
  }

  return (
    <Container className='mt-4'>
      <Form onSubmit={handleSubmit}>
        <Form.Group className='mb-3' controlId='email'>
          <Form.Label>Email - droneacademy@droneacademy.hr</Form.Label>
          <Form.Control
            type='text'
            name='email'
            placeholder='droneacademy@droneacademy.hr'
            maxLength={255}
            required
          />
        </Form.Group>
        <Form.Group className='mb-3' controlId='lozinka'>
          <Form.Label>Lozinka - droneacademy</Form.Label>
          <Form.Control type='password' name='lozinka' required placeholder='droneacademy' />
        </Form.Group>
        <Button variant='primary' className='gumb' type='submit'>
          Autoriziraj
        </Button>
      </Form>
    </Container>
  );
}
