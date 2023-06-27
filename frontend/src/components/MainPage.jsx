import NavbarComp from './Navbar';
import Channels from './Channels';
import Chat from './Chat';
import router from '../routes'
import { AddChannelModal, RemoveModal, RenameModal } from './ModalWindows';
import { useContext, useEffect, useRef } from 'react';
import { AuthorizationContext } from './AuthorizationContext.jsx';
import SocketContext from './SocketContext.jsx';
import axios from 'axios';
import io from 'socket.io-client';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { Container } from 'react-bootstrap';
import { actions as channelsActions } from '../slices/channelsSlice.js';
import { actions as messagesActions } from '../slices/messagesSlice.js';
import { actions as modalActions } from '../slices/modalSlice.js';
import { useTranslation } from 'react-i18next';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

const MainPage = () => {
  // подключаем i18n для словаря
  const { t } = useTranslation();
  //функция для вывода сообщений о ошибках
  const notify = (text) => toast(text);
  //активируем useNavigate для переадресации на другую страницу, которые прописаны в роутере в файле App
  const navigate = useNavigate();
  //активируем useDispatch для запуска экшенов для Стора
  const dispatch = useDispatch();
  //оздаем реф для того тчо бы передать его с контекстом для компонентов, которые будут передавать данные и сокет в слайс
  const socketRef = useRef(null);
  //добавляем данные из контекста, предварительно импортировав его
  const isAutorization = useContext(AuthorizationContext);
  //прописываем через хук useEffect который срабатывает после первого рендера только, если есть
  //токен, то рендерится главная страница, если нет, то кидает на страницу логина
  useEffect(() => {
    if (!isAutorization()) {return navigate('/login')};
    //если прошла проверка сверху, то подтягивает стейт, при этом надо в каждый запрос добавлять токен авторизации в headers
    //который в axios присоединяется в виде объекта
    const token = localStorage.getItem('token');
    //асинхронные функции в useEffect пишем внутри и запускаем тут же
    const getInitialData = async () => {
      try {
        const { data } = await axios.get(router('data'), {headers: {
          'Authorization': `Bearer ${token}`
        }});
        //загружаем первичные данные в наш стейт
        //поодтягиваем каналы с сервера
        dispatch(channelsActions.setUpChannels(data.channels));
        //подтягиваем сообщения с сервера
        dispatch(messagesActions.setUpMessages(data.messages));
      } catch (e) {
        //!!!!!отлавливаем ошибки и если что выводим их в выскакивающее окно
        dispatch(modalActions.changeToastMessage('forms.errors.networkError'));
      }
    };
    //запуск функции
    getInitialData();

    //Подписываемся на обновления с сервера через socket.io c авторизацией, запускается только в первый рендер
    const getSocket = () => {
      try { return io('http://localhost:5001', {
        extraHeaders: {
          'Authorization': `Bearer ${token}`,
        },
      });
      } catch (e) {
        dispatch(modalActions.changeToastMessage('forms.errors.networkError'));
      }
    };
    const socket = getSocket();
    /* записываем созданный сокет в ref созданный ранее для того тчо бы передать его с контекстом для компонентов, которые будут передавать
      данные и сокет в асинхронные экшены в слайсах */
    socketRef.current = socket;
    /*при отправке нами сообщения, или другими пользователями, мы не записываем сраазу в стор его, так как 
      при отправке своих сообщений будет записываться дважды и понадобится дополнительная логика для обновления
      что бы этого избежать, мы записываем только когда получаем ответ от сервера, когда всё записалось там после\
      нашего отправленного через сокет запроса на запись новых данных на сервер, из thunk в слайсах
      Открываем тут каналы для "прослушки" данных от сервера и вызовов соответствующих экшенов в слайсах для записи в стор */
    socket.on('newMessage', (payload) => {
      dispatch(messagesActions.addMessage(payload));
    });

    socket.on('newChannel', (payload) => {
      dispatch(channelsActions.addChannel(payload));
    });

    socket.on('removeChannel', (payload) => {
      dispatch(channelsActions.removeChannel(payload));
    });

    socket.on('renameChannel', (payload) => {
      dispatch(channelsActions.renameChannel(payload));
    });

    //при размонтировании закрываем соединение
    return () => {
      socket.disconnect();
    };
  }, [dispatch, isAutorization, navigate, t]);

  //селектор для модалки toastify
  const toastMessage = useSelector((state) => state.modalReducer.modalUi.toastMessage);
  /* useEffect реагирующий на изменения toastMessage и вызывающий показ уведомления, прописываем условие, что бы не сраатывало 
    при первом рендере*/
  useEffect(() => {
    toastMessage && notify(t(toastMessage))
    dispatch(modalActions.resetToastMessage())
  }, [toastMessage, t]);

  //селекторы для пропсов компонентов
  const currentChannelId = useSelector((state) => state.currentChannelIdReducer.currentChannelId);
  const channels = useSelector((state) => state.channelsReducer.channels);
  const messages = useSelector((state) => state.messagesReducer.messages);
  const currentChannel = channels.find((channel) => channel.id === currentChannelId);
  const currentMessages = messages.filter((message) => message.channelId === currentChannelId);
  //передаем сокет через провайдер для использования в формах для отправки данных на сервер
  return (
    //передаем сокет через провайдер
    <SocketContext.Provider value={socketRef.current}>
      <div className="h-100" id="chat">
        <div className="d-flex flex-column h-100">
          {/*Передаем props в  NavbarComp c запущенной функцией авторизации из контекста
            которая возвращает true или false и меняет внешний вид NavBar с кнопкой Выход или без*/}
          <NavbarComp authorization={isAutorization()}/>
          <Container className="h-100 my-4 overflow-hidden rounded shadow">
            <div className="row h-100 bg-white flex-md-row">
              {/* Передаем в пропсы каналы и текущий активный ID канала, а в чат текущий канал и текущие сообщения, всё 
              сделано так что бы при переключении каналов, сообщения сразу менялись на нужные */}
              <Channels channels={channels} currentChannelId={currentChannelId}/>
              <Chat currentChannel={currentChannel} currentMessages={currentMessages}/>
            </div>
          </Container>
        </div>
      </div>
      {/* Здесь переданы 3 вида модальных окон для добавления, удаления и переименовая каналов */}
      <AddChannelModal />
      <RemoveModal />
      <RenameModal />
      <ToastContainer />
    </SocketContext.Provider>
  );
};
export default MainPage;
