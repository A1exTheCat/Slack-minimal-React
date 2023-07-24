import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { Provider, ErrorBoundary } from '@rollbar/react';
import i18next from 'i18next';
import { initReactI18next } from 'react-i18next';
import Login from './components/Login';
import MainPage from './components/MainPage';
import Page404 from './components/Page404';
import Signup from './components/Signup';
import './assets/application.scss';
import { AuthorizationContext, isAuthorization } from './components/AuthorizationContext.jsx';
import ruTranslation from './locales/ru.js'; // Импортируйте файлы локализации
import enTranslation from './locales/en.js';

// Инициализация локализации
i18next
  .use(initReactI18next)
  .init({
    resources: { // передаем переводы текстов интерфейса в формате JSON
      en: {
        translation: enTranslation,
      },
      ru: {
        translation: ruTranslation,
      },
    },
    debug: false,
    fallbackLng: 'en', // если переводы на языке пользователя недоступны, то будет использоваться язык, указанный в этом поле
    interpolation: {
      escapeValue: false, // экранирование уже есть в React, поэтому отключаем
    },
  });
// конфигурации Rollbar для отлова ошибок
const rollbarConfig = {
  accessToken: '5967f27a027f4e30996d5fde1062b6ed',
  environment: 'testenv',
};

/* Логика рутинга и прикрепляем контекст, предварительно импортировав его для проверки
есть ли токен в сторедже браузера или нет, что значит что он залогинен
В контексте лежит сама функция, вытаскиваем её из контекста в нужных нам местах и запускаем
path=* нужен специально для всех неверных запросов страниц и вывода для них страницы 404 */
const App = () => (
  <Provider config={rollbarConfig}>
    <ErrorBoundary>
      <BrowserRouter>
        <AuthorizationContext.Provider value={isAuthorization}>
          <Routes>
            <Route path="/" element={<MainPage />} />
            <Route path="login" element={<Login />} />
            <Route path="*" element={<Page404 />} />
            <Route path="signup" element={<Signup />} />
          </Routes>
        </AuthorizationContext.Provider>
      </BrowserRouter>
    </ErrorBoundary>
  </Provider>
);

export default App;
