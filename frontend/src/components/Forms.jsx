import {
  FloatingLabel,
  Button,
  Form,
  InputGroup,
} from 'react-bootstrap';
import { useTranslation } from 'react-i18next';
import { useNavigate } from 'react-router-dom';
import { useFormik } from 'formik';
import { useRef, useEffect, useContext } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import * as Yup from 'yup';
import axios from 'axios';
import { addMessageThunk } from '../slices/messagesSlice.js'
import { actions as messagesActions } from '../slices/messagesSlice.js';
import SocketContext from './SocketContext';
import router from '../routes';

// Создаем компонент формы для входа

function LoginForm() {
  const { t } = useTranslation();
  /* прописываем через хук useRef для доступа к дом элементам, для их изменения 3 ссылки,
   в самих элементах в атрибутах прописываем эти имена в атрибут "ref" */
  const navigate = useNavigate();
  const errorRef = useRef(null);
  const inputNameRef = useRef(null);
  const inputPassRef = useRef(null);
  // инициализируем хук useFormik и прописываем "его стейт временный для наших полей" 
  const formik = useFormik({
    initialValues: {
      username: '',
      password: '',
    },
    // прописываем что будем делать при сабмите через трай кетч для отлавливания ошибок
    onSubmit: async (values) => {
      try {
        // отправляем запрос на сервер(предварительно запускаем его если темтим с компа), отправляем наши данные на сервер,
        // получем токен и записываем его в локал сторадж, оттуда мы его потом можем вытаскивать в любых местах в браузере
        const authorizationResponse = await axios.post(router('login'), values);
        localStorage.setItem('token', authorizationResponse.data.token);
        localStorage.setItem('username', authorizationResponse.data.username);
        /*так как вернулся токен, значит аутификация прошла удачно и мы переадресовываем на
         основную страницу чата*/
        navigate('/');
      } catch (e) {
        /*здесь через ссылки объявленные выше мы добавляем классы "is-invalid" в инпуты и 
        удаляем и добавляем класс в див тулкита с описанием ошибки, что бы её вывели на экран
        кажется это фигня какая то, и надо по другому это реализовывать, в конце проверить */
        inputNameRef.current.classList.add('is-invalid');
        inputPassRef.current.classList.add('is-invalid');
        inputNameRef.current.focus();
        errorRef.current.classList.remove("valid-tooltip");
        errorRef.current.classList.add("invalid-tooltip");
      }
    }
  });
// для чека пустых инпутов просто вписывается required в пропсы компонента
// для формика прописано value и onChange
  return (
    <Form onSubmit={formik.handleSubmit} className="col-12 col-md-6 mt-3 mt-mb-0">
      <h1 className="text-center mb-4">{t('forms.login')}</h1>
      <FloatingLabel
        controlId="username"
        label={t('forms.nickName')}
        className="mb-3"
      >
        <Form.Control
          ref={inputNameRef}
          type="username"
          name="username"
          className="form-control"
          onChange={formik.handleChange}
          value={formik.values.username}
          required
        />
      </FloatingLabel>
      <FloatingLabel
        controlId="password"
        label={t('forms.password')}
        className="mb-3"
      >
        <Form.Control ref={inputPassRef} type="password" name="password" className="form-control" onChange={formik.handleChange}
        value={formik.values.password} required/>
        <Form.Control.Feedback ref={errorRef} tooltip>{t('forms.errors.loginError')}</Form.Control.Feedback>
      </FloatingLabel>
      <Button className="w-100 mb-3 btn btn-primary" type="submit">{t('forms.login')}</Button>
    </Form>
  );
}

function ChatForm() {
  const { t } = useTranslation();
  // создаем реф для фокусировки на инпуте при переходе на чат
  const chatFormRef = useRef(null);
  const dispatch = useDispatch();
  // схема проверки и верификации чата, через формик можно эти ошибки выводить в блок фидбек
  const chatSchema = Yup.object().shape({
    body: Yup.string()
      .min(1, t('forms.errors.minMessage'))
      .required(t('forms.errors.requiredError')),
  });
  // передаем сокент из контекста для отправки сообщений через thunk, сокет передает вторым параметром
  const socket = useContext(SocketContext);
  //подтягиваем имя из localStorage
  const username = localStorage.getItem('username');
  const channelId = useSelector((state) => state.currentChannelIdReducer.currentChannelId);
  // фокус только если поменялся канал
  useEffect(() => {
    chatFormRef.current.focus();
  }, [channelId])
  //создаем экземпляр формы через formik
  const formik = useFormik({
    initialValues: {
      body:"",
    },
    validationSchema: chatSchema,
    onSubmit: (values) => {
      const newMessageData = {...values, username, channelId};
      dispatch(messagesActions.addMessage(newMessageData));
      //dispatch(addMessageThunk({ newMessageData, socket, dispatch }));
      //сброс инпута методами formik 
      formik.setValues({ body: '' });
      //сброс фокуса через ref 
      chatFormRef.current.blur();
    },
  });
  // в форме для блокировки кнопки отправки при пустом поле добавляем атрибут на кнопку disabled={!formik.isValid}
  return (
    <Form noValidate onSubmit={formik.handleSubmit} className="py-1 border rounded-2">
      <InputGroup className="has-validation">
        <Form.Control
        ref={chatFormRef}
        aria-label={t('forms.newMessage')}
        type="text"
        placeholder={t('forms.enterMessage')}
        name="body"
        className="border-0 p-0 ps-2"
        onChange={formik.handleChange}
        value={formik.values.body} />
        <Button variant="text-primary" type="submit" className="btn-group-vertical border-0" disabled={!formik.isValid}>
          <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 16 16" width="20" height="20" fill="currentColor">
            <path fill-rule="evenodd" d="M15 2a1 1 0 0 0-1-1H2a1 1 0 0 0-1
              1v12a1 1 0 0 0 1 1h12a1 1 0 0 0 1-1V2zM0 2a2 2 0 0 1 2-2h12a2
              2 0 0 1 2 2v12a2 2 0 0 1-2 2H2a2 2 0 0 1-2-2V2zm4.5 5.5a.5.5 0 0 0 0 1h5.793l-2.147 2.146a.5.5 0 0 0 .708.708l3-3a.5.5 0 0 0 0-.708l-3-3a.5.5 0 1 0-.708.708L10.293 7.5H4.5z"></path>
            </svg>
          <span className="visually-hidden">Отправить</span>
        </Button>
      </InputGroup>
    </Form>
  )
}
//форма для регистрации
function RegistrationForm() {
  const { t } = useTranslation();
  //создаем ref для фокуса на инпуте и навигацию для переадресации после удачной регистрации
  const userNameRef = useRef(null);
  const navigate = useNavigate();
  //фокус при первом рендере
  useEffect(() => {
    userNameRef.current.focus();
  }, [])
  /*схема валидации, из особенностей - oneOf и Yup.ref для чека совпадения значений */
  const registrationSchema = Yup.object().shape({
    username: Yup.string()
      .min(3, t('forms.errors.symbolsError'))
      .max(20, t('forms.errors.symbolsError'))
      .required(t('forms.errors.requiredError')),
    password: Yup.string()
      .min(6, t('forms.errors.minPasswordError'))
      .required(t('forms.errors.requiredError')),
    repeatPassword: Yup.string()
      .oneOf([Yup.ref('password'), null], t('forms.errors.MatchingPasswordError'))
      .required(t('forms.errors.requiredError')),
  });

  const formik = useFormik({
    initialValues: {
      username: '',
      password: '',
      repeatPassword: '',
    },
    validationSchema: registrationSchema,
    onSubmit: async (values) => {
      try {
        const { username, password } = values;
        //отправляем запрос на сервер, отправляем наши данные на сервер,
        //получем токен и записываем его в локал сторадж, оттуда мы его потом можем вытаскивать в любых местах в браузере
        const signUpResponse = await axios.post(router('signup'), { username, password });
        localStorage.setItem('token', signUpResponse.data.token);
        localStorage.setItem('username', signUpResponse.data.username);
        //так как вернулся токен, значит аутификация прошла удачно и мы переадресовываем на основную страницу чата
        navigate('/');
      } catch (e) {
        /* Если ошибка, то фокусируемся и выделяем логин через рефы,
        ошибки очищаем через формик напрямую, и выдаем ошибку в зависимости от статуса*/
        userNameRef.current.focus();
        userNameRef.current.select();
        formik.errors.username = ' ';
        formik.errors.password = ' ';
        if (e.response.status === 409) {
          formik.errors.repeatPassword = t('forms.errors.uniqeNameError');
        } else {
          formik.errors.repeatPassword = t('forms.errors.networkError');
        }
      }
    },
  });
  // небольшая функция для проверки было ли уже поле тронуто и имеет при этом уже ошибки, если хотя бы один false, то вернет false
  const isInvalid = (fieldName) => formik.touched[fieldName] && formik.errors[fieldName];
  /* В форме добавляем атрибуты onBlur для отслеживания касаний инпутов, иначе не зафиксируется
  и в классы добавляем функцию для проверки на касания и ошибки что бы предупреждение выводилось только для одного инпута и только
  если его уже коснулись и оно не прошло валидацию
  Следом идет блок с выводом ошибок, в нем проверка опять функцией на ошибки и касание, если функция возвращает тру, то
  рендерится ошибка из формика */
  return (
    <Form onSubmit={formik.handleSubmit} className="col-12 col-md-6 mt-3 mt-mb-0">
      <h1 className="text-center mb-4">{t('forms.signup')}</h1>
      <FloatingLabel
        controlId="username"
        label={t('forms.name')}
        className="mb-3"
      >
        <Form.Control
          ref={userNameRef}
          type="text"
          name="username"
          placeholder={t('forms.errors.symbolsError')}
          className={`${isInvalid('username') ? 'is-invalid' : ''}`}
          onBlur={formik.handleBlur}
          onChange={formik.handleChange}
          value={formik.values.username}
        />
        {isInvalid('username') && (
          <div className="invalid-tooltip" placement="right">
            {formik.errors.username}
          </div>
        )}
      </FloatingLabel>
      <FloatingLabel
        controlId="password"
        label={t('forms.password')}
        className="mb-3"
      >
        <Form.Control
          type="password"
          name="password"
          placeholder={t('forms.errors.minPasswordError')}
          className={`${isInvalid('password') ? 'is-invalid' : ''}`}
          onChange={formik.handleChange}
          onBlur={formik.handleBlur}
          value={formik.values.password}
        />
        {isInvalid('password') && (
          <div className="invalid-tooltip right">
            {formik.errors.password}
          </div>
        )}
      </FloatingLabel>
      <FloatingLabel
        controlId="repeatPassword"
        label={t('forms.ensurePassword')}
        className="mb-3"
      >
        <Form.Control
          type="password"
          name="repeatPassword"
          placeholder={t('forms.errors.MatchingPasswordError')}
          className={`${isInvalid('repeatPassword') ? 'is-invalid' : ''}`}
          onChange={formik.handleChange}
          onBlur={formik.handleBlur}
          value={formik.values.repeatPassword}
        />
        {isInvalid('repeatPassword') && (
          <div className="invalid-tooltip right">
            {formik.errors.repeatPassword}
          </div>
        )}
      </FloatingLabel>
      <Button className="w-100 mb-3 btn btn-primary" type="submit">{t('forms.signingUp')}</Button>
    </Form>
  );
}

export { LoginForm, ChatForm, RegistrationForm };
