import { Image } from 'react-bootstrap';
import NavbarComp from './Navbar';

const Page404 = () => (
  <div className="h-100" id="chat">
    <div className="d-flex flex-column h-100">
      <NavbarComp />
      <div className="text-center">
      <Image alt="Страница не найдена" fluid className="h-25"
        src="https://cdn2.hexlet.io/assets/error-pages/404-4b6ef16aba4c494d8101c104236304e640683fa9abdb3dd7a46cab7ad05d46e9.svg"/>
      <h1 className="h4 text-muted">Страница не найдена</h1>
      <p className="text-muted">Но вы можете перейти <a href="/">на главную страницу</a></p>
      </div>
    </div>
  </div>
);

export default Page404;