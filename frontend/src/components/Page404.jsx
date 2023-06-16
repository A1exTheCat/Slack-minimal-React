import { Image } from 'react-bootstrap';
import NavbarComp from './Navbar';
import Svg404 from '../assets/404Img.svg';

const Page404 = () => (
  <div className="h-100" id="chat">
    <div className="d-flex flex-column h-100">
      <NavbarComp />
      <div className="text-center">
      <Image src={Svg404} alt="Страница не найдена" fluid className="h-25"/>
      <h1 className="h4 text-muted">Страница не найдена</h1>
      <p className="text-muted">Но вы можете перейти <a href="/">на главную страницу</a></p>
      </div>
    </div>
  </div>
);

export default Page404;