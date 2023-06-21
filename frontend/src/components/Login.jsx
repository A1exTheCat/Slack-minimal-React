import { Row, Container, Card, Image } from 'react-bootstrap';
import NavbarComp from './Navbar';
import { LoginForm } from './Forms';
import loginImg from '../assets/loginImg.jpg';
import { useTranslation } from 'react-i18next';

function Login() {
  const { t } = useTranslation();

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
                    <Image src={loginImg}
                      alt={t('forms.login')} className="rounded-circle">
                    </Image>
                  </div>
                  <LoginForm />
                </Card.Body>
                <Card.Footer className="p-4">
                  <div className="text-center">
                    <span>{t('forms.isAccountExisted')} </span>
                    <a href="/signup">{t('forms.signup')}</a>
                  </div>
                </Card.Footer>
              </Card>
            </div>
          </Row>
        </Container>
      </div>
    </div>
  );
}

export default Login;