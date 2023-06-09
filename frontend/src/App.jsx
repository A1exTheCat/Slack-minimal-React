import { BrowserRouter, Routes, Route } from 'react-router-dom';
import Login from './components/Login';
import MainPage from './components/MainPage';
import Page404 from './components/Page404';
import './assets/application.scss';
import { AuthorizationContext, isAuthorization } from './components/AuthorizationContext.jsx';


//Логика рутинга и прикрепляем контекст, предварительно импортировав его для проверки есть ли токен в сторедже браузера или нет, что значит что он залогинен
function App() {
  return (
    <BrowserRouter>
      <AuthorizationContext.Provider value={isAuthorization()}>
        <Routes>
          <Route path="/" element={<MainPage /> } />
          <Route path="login" element={<Login />} />
          <Route path="*" element={<Page404 />} />
        </Routes>
      </AuthorizationContext.Provider>
    </BrowserRouter>
  );
}

export default App;