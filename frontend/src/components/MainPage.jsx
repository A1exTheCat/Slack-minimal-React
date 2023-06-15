import NavbarComp from './Navbar';
import Channels from './Channels';
import Chat from './Chat';
import { AddChannelModal, RemoveModal, RenameModal } from './ModalWindows';
import { useContext, useEffect, useRef } from 'react';
import { AuthorizationContext } from './AuthorizationContext.jsx';
import SocketContext from './SocketContext.jsx';
import axios from 'axios';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import io from 'socket.io-client';
import { Container } from 'react-bootstrap';
import { actions as channelsActions } from '../slices/channelsSlice.js';
import { actions as messagesActions } from '../slices/messagesSlice.js';
import { actions as currentChannelIdActions } from '../slices/currentChannelIdSlice.js';



const MainPage = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const socketRef = useRef(null);
  //добавляем данные из контекста, предварительно импортировав его
  const isAutorization = useContext(AuthorizationContext);
  //прописываем через хук юз эффект который срабатывает после каждого рендера, если есть 
  //токен, то рендерится главная страница, если нет, то кидает на страницу логина
  useEffect(() => {
    if (!isAutorization) {navigate('/login')};
    //если прошла проверка сверху, то подтягивает стейт, при этом надо в каждыйзапрос добавлять токен авторизации в хедере
    //который в акисос присоединяется в виде объекта
    const token = localStorage.getItem('token');
    //асинхронные функции в useEffect пишем внутри и запускаем тут же
    const getInitialData = async () => {
      try {
        const { data } = await axios.get('/api/v1/data', {headers: {
          'Authorization': `Bearer ${token}`
        }});
        //загружаем первичные данные в наш стейт
        dispatch(channelsActions.setUpChannels(data.channels));
        dispatch(messagesActions.setUpMessages(data.messages));
        dispatch(currentChannelIdActions.updateId(data.currentChannelId));
      } catch (e){
        console.log('Проблемы с сетью');
      }
    };
    //запуск функции
    getInitialData();

    //Подписываемся на обновления с сервера через socket.io c авторизацией
    const socket = io('http://localhost:3000', {
      extraHeaders: {
        'Authorization': `Bearer ${token}`,
      },
    });
    //создаем реф для того тчо бы передать его с контекстом для компонентов, которые будут передавать
    //данные и сокет в слайс
    socketRef.current = socket;
    //при отправке нами сообщения, или другими пользователями, мы не записываем сраазу в стор его, так как 
    //при отправке своих сообщений будет записываться дважды и понадобится дополнительная логика для обновления
    //что бы этого избежать, мы записываем только когда получаем ответ от сервера что всё записалось там
    socket.on('newMessage', (payload) => {
      dispatch(messagesActions.addMessage(payload));
    });

    socket.on('newChannel', (payload) => {
      dispatch(channelsActions.addChannel(payload));
      console.log(payload) // { id: 6, name: "new channel", removable: true }
    });

    socket.on('removeChannel', (payload) => {
      dispatch(channelsActions.removeChannel(payload));
      console.log(payload); // { id: 6 };
    });

    socket.on('renameChannel', (payload) => {
      dispatch(channelsActions.renameChannel(payload));
      console.log(payload); // { id: 7, name: "new name channel", removable: true }
    });
    //при размонтировании закрываем соединение
    return () => {
      socket.disconnect();
    };
  }, []);

  //селекторы для пропсов компонентов
  const currentChannelId = useSelector((state) => state.currentChannelIdReducer.currentChannelId);
  const channels = useSelector((state) => state.channelsReducer.channels);
  const messages = useSelector((state) => state.messagesReducer.messages);
  const currentChannel = channels.find((channel) => channel.id === currentChannelId);
  const currentMessages = messages.filter((message) => message.channelId === currentChannelId);
  //передаем сокет через провайдер для использования в формах
  return (
    <SocketContext.Provider value={socketRef.current}>
      <div className="h-100" id="chat">
        <div className="d-flex flex-column h-100">
          <NavbarComp authorization={isAutorization}/>
          <Container className="h-100 my-4 overflow-hidden rounded shadow">
            <div className="row h-100 bg-white flex-md-row">
              <Channels channels={channels} currentChannelId={currentChannelId}/>
              <Chat currentChannel={currentChannel} currentMessages={currentMessages}/>
            </div>
          </Container>
        </div>
      </div>
      <AddChannelModal />
      <RemoveModal />
      <RenameModal />
    </SocketContext.Provider>
  );
};
export default MainPage;
