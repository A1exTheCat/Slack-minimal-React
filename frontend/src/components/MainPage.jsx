import NavbarComp from './Navbar';
import Channels from './Channels';
import Chat from './Chat';
import { useContext, useEffect } from 'react';
import { AuthorizationContext } from './AuthorizationContext.jsx';
import axios from 'axios';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';

import { actions as channelsActions } from '../slices/channelsSlice.js';
import { actions as messagesActions } from '../slices/messagesSlice.js';
import { actions as currentChannelIdActions } from '../slices/currentChannelIdSlice.js';
import { Container } from 'react-bootstrap';


const MainPage = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
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
  }, []);

  const currentChannelId = useSelector((state) => state.currentChannelIdReducer.currentChannelId);
  const channels = useSelector((state) => state.channelsReducer.channels);
  const messages = useSelector((state) => state.messagesReducer.messages);
  const currentChannel = channels.find((channel) => channel.id === currentChannelId);
  const currentMessages = messages.filter((message) => message.channelId === currentChannelId);

  return (
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
  );
};
export default MainPage;
