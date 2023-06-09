import { Container, Navbar } from 'react-bootstrap';

const NavbarComp = (props) => (
  <Navbar bg="dark" variant="dark" expand="lg" className="shadow-sm">
    <Container>
      <Navbar.Brand href="/">
        Hexlet Chat
      </Navbar.Brand>
      {props.authorization && <button type="button" class="btn btn-light">Выйти</button>}
    </Container>
  </Navbar>
);

export default NavbarComp;