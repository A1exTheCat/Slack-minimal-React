import { FloatingLabel, Button, Form, InputGroup } from 'react-bootstrap';
import { useNavigate } from 'react-router-dom';
import { useFormik } from 'formik';
import { useRef, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { addMessage } from '../slices/messagesSlice.js'
import axios from 'axios';
import * as Yup from 'yup';
import { useContext } from 'react';
import SocketContext from './SocketContext';

// схемы проверки и верификации, через формик можно эти ошибки выводить в блок фидбек
const chatSchema = Yup.object().shape({
    body: Yup.string()
      .min(1, 'Минимум 1 буква')
      .required('Обязательное поле'),
  });

//Создаем компонент формы для входа

function LoginForm() {
  // прописываем через хук useRef для доступа к дом элементам, для их изменения 3 ссылки, в самих элементах в атрибутах прописываем эти имена в атрибут "ref"
  const navigate = useNavigate();
  const errorRef = useRef(null);
  const inputNameRef = useRef(null);
  const inputPassRef = useRef(null);
  //инициализируем хук useFormik и прописываем "его стейт временный для наших полей" 
  const formik = useFormik({
    initialValues: {
      username:"",
      password:""
    },
  //прописываем что будем делать при сабмите через трай кетч для отлавливания ошибок
    onSubmit: async (values) => {
      try {
        //отправляем запрос на сервер(предварительно запускаем его если темтим с компа), отправляем наши данные на сервер,
        //получем токен и записываем его в локал сторадж, оттуда мы его потом можем вытаскивать в любых местах в браузере
        const authorizationResponse = await axios.post('/api/v1/login', values);
        localStorage.setItem('token', authorizationResponse.data.token);
        localStorage.setItem('username', authorizationResponse.data.username);
        //так как вернулся токен, значит аутификация прошла удачно и мы переадресовываем на основную страницу чата(возможно надо через хук хистори, можно потом переделать)
        navigate('/');
      } catch (e) {
        //здесь через ссылки объявленные выше мы добавляем классы "is-invalid" в инпуты и удаляем и добавляем класс в див тулкита с описанием ошибки, что бы её вывели на экран
        //кажется это фигня какая то, и надо по другому это реализовывать, в конце проверить
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
      <h1 className="text-center mb-4">Войти</h1>
      <FloatingLabel
        controlId="floatingInput"
        label="Ваш ник"
        className="mb-3"
      >
        <Form.Control ref={inputNameRef} type="username" name="username" className="form-control" onChange={formik.handleChange}
        value={formik.values.username} required/>
      </FloatingLabel>
      <FloatingLabel
        controlId="floatingPassword"
        label="Пароль"
        className="mb-3"
      >
        <Form.Control ref={inputPassRef} type="password" name="password" className="form-control" onChange={formik.handleChange}
        value={formik.values.password} required/>
        <Form.Control.Feedback ref={errorRef} tooltip>Неверные имя пользователя или пароль</Form.Control.Feedback>
      </FloatingLabel>
      <Button className="w-100 mb-3 btn btn-primary" type="submit">Войти</Button>
    </Form>
  );
}

function ChatForm() {
  const chatFormRef = useRef(null);
  const dispatch = useDispatch();
  const socket = useContext(SocketContext);
  const username = localStorage.getItem('username');
  const channelId = useSelector((state) => state.currentChannelIdReducer.currentChannelId);
  // фокус только если поменялся канал
  useEffect(() => {
    chatFormRef.current.focus();
  }, [channelId])

  const formik = useFormik({
    initialValues: {
      body:"",
    },
    validationSchema: chatSchema,
    onSubmit: (values) => {
      const newMessageData = {...values, username, channelId};
      dispatch(addMessage({ newMessageData, socket }));
      //сброс инпута
      formik.setValues({ body: '' });
      //сброс фокуса
      chatFormRef.current.blur();
    },
  });

  return (
    <Form noValidate onSubmit={formik.handleSubmit} className="py-1 border rounded-2">
      <InputGroup controlId="">
        <Form.Control
        ref={chatFormRef}
        aria-label="Новое сообщение"
        type="body" 
        placeholder="Введите сообщение..."
        name="body" 
        className="form-control border-0 p-0 ps-2"
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

function RegistrationForm() {
  const userNameRef = useRef(null);
  const navigate = useNavigate();

  useEffect(() => {
    userNameRef.current.focus();
  }, [])

  const registrationSchema = Yup.object().shape({
    username: Yup.string()
      .min(3, 'От 3 до 20 символов')
      .max(20, 'От 3 до 20 символов')
      .required('Обязательное поле'),
    password: Yup.string()
      .min(6, 'Не менее 6 символов')
      .required('Обязательное поле'),
    repeatPassword: Yup.string()
    .oneOf([Yup.ref('password'), null], 'Пароли должны совпадать')
    .required('Обязательное поле'),
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
        //отправляем запрос на сервер(предварительно запускаем его если темтим с компа), отправляем наши данные на сервер,
        //получем токен и записываем его в локал сторадж, оттуда мы его потом можем вытаскивать в любых местах в браузере
        const signUpResponse = await axios.post('/api/v1/signup', { username, password });
        localStorage.setItem('token', signUpResponse.data.token);
        localStorage.setItem('username', signUpResponse.data.username);
        //так как вернулся токен, значит аутификация прошла удачно и мы переадресовываем на основную страницу чата
        navigate('/');
      } catch (e) {
        userNameRef.current.focus();
        userNameRef.current.select();
        formik.errors.username = ' ';
        formik.errors.password = ' ';
        if (e.response.status === 409) {
          formik.errors.repeatPassword = 'Такой пользователь уже существует';
        } else {
          formik.errors.repeatPassword = 'Ошибка сети';
        }
      }
    },
  });

  const isInvalid = (fieldName) => formik.touched[fieldName] && formik.errors[fieldName];

  return (
    <Form onSubmit={formik.handleSubmit} className="col-12 col-md-6 mt-3 mt-mb-0">
      <h1 className="text-center mb-4">Регистрация</h1>
      <FloatingLabel
        label="Имя пользователя"
        className="mb-3"
      >
        <Form.Control
          ref={userNameRef}
          type="text"
          id="username"
          name="username"
          placeholder="Имя пользователя"
          className={`${isInvalid('username') ? 'is-invalid' : ''}`}
          onBlur={formik.handleBlur}
          onChange={formik.handleChange}
          value={formik.values.username}
        />
        {isInvalid('username') && (
          <div className="invalid-tooltip right">
            {formik.errors.username}
          </div>
        )}
      </FloatingLabel>
      <FloatingLabel
        label="Пароль"
        className="mb-3"
      >
        <Form.Control
          type="password"
          id="password"
          name="password"
          placeholder="Пароль"
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
        label="Подтвердите пароль"
        className="mb-3"
      >
        <Form.Control
          type="password"
          id="repeatPassword"
          name="repeatPassword"
          placeholder="Подтвердите пароль"
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
      <Button className="w-100 mb-3 btn btn-primary" type="submit">Зарегистрироваться</Button>
    </Form>
  );
}

export { LoginForm, ChatForm, RegistrationForm };
