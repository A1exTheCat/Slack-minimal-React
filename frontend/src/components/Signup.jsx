import { Row, Container, Card, Image } from 'react-bootstrap';
import NavbarComp from './Navbar';
import { RegistrationForm } from './Forms';
import signUpImg from '../assets/signUpImg.jpg';

function SignUp() {
  return (
    <div className="h-100 w-100" id="chat">
      <div className="d-flex flex-column h-100">
        <NavbarComp />
        <Container fluid className="h-100">
          <Row className="justify-content-center align-content-center h-100">
            <div className="col-12 col-md-8 col-xxl-6">
              <Card className="shadow-sm">
                <Card.Body className="row p-5">
                  <div className="col-12 col-md-6 d-flex align-items-center justify-content-center">
                    <Image src={signUpImg}
                      alt="Войти" className="rounded-circle">
                    </Image>
                  </div>
                  <RegistrationForm />
                </Card.Body>
              </Card>
            </div>
          </Row>
        </Container>
      </div>
    </div>
  );
}

export default SignUp;