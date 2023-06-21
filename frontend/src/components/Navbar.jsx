import { Container, Navbar } from 'react-bootstrap';
import { useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';

const NavbarComp = (props) => {
  const { t } = useTranslation();
  /*два хука для переадресации по нажатию на ссылку и кнопку выход,
    а так же для проверки на какой ты странице в данный момент */
  const navigate = useNavigate();
  /* Логика кнопки "выход", удаляем токен и username и перекидываем
    на страницу логина */
  const handleClick = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('username');
    navigate('/login');
  };

  return (
  <Navbar bg="dark" variant="dark" expand="lg" className="shadow-sm">
    <Container>
      {/* Проверяем на странице мы "/" и если нет, то сыылка будет вести на нее,
        а если мы на ней, то ссылка будет неактивной */}
      <Navbar.Brand href='/'>
        Hexlet Chat
      </Navbar.Brand>
      {props.authorization && <button onClick={handleClick} type="button" class="btn btn-light">{t('navBar.exit')}</button>}
    </Container>
  </Navbar>
)};

export default NavbarComp;