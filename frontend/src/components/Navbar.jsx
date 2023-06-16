import { Container, Navbar } from 'react-bootstrap';
import { useNavigate, useLocation, Link } from 'react-router-dom';

const NavbarComp = (props) => {
  const navigate = useNavigate();
  const location = useLocation();

  const handleClick = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('username');
    navigate('/login');
  };

  return (
  <Navbar bg="dark" variant="dark" expand="lg" className="shadow-sm">
    <Container>
      <Navbar.Brand href={location.pathname !== '/'? '/': null}>
        Hexlet Chat
      </Navbar.Brand>
      {props.authorization && <button onClick={handleClick} type="button" class="btn btn-light">Выйти</button>}
    </Container>
  </Navbar>
)};

export default NavbarComp;