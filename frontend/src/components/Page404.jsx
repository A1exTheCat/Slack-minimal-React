import { useTranslation } from 'react-i18next';
import { Image } from 'react-bootstrap';
import NavbarComp from './Navbar';
import Svg404 from '../assets/404Img.svg';

// изинтересного только подгрузка svg картинки из файла путем импорта
const Page404 = () => {
  const { t } = useTranslation();
  return (
    <div className="h-100" id="chat">
      <div className="d-flex flex-column h-100">
        <NavbarComp />
        <div className="text-center">
          <Image src={Svg404} alt="Страница не найдена" fluid className="h-25" />
          <h1 className="h4 text-muted">{t('page404.noPage')}</h1>
          <p className="text-muted">
            {`${t('page404.canRelocate')} `}
            <a href="/">{t('page404.toMainPage')}</a>
          </p>
        </div>
      </div>
    </div>
  );
};

export default Page404;
