import { useContext, useEffect } from 'react';
import { AuthorizationContext } from './AuthorizationContext.jsx';
import axios from 'axios';
import { useDispatch, useSelector } from 'react-redux';

import { actions as channelsActions } from '../slices/channelsSlice.js';
import { actions as messagesActions } from '../slices/messagesSlice.js';
import { actions as currentChannelIdActions } from '../slices/currentChannelIdSlice.js';
import { Button, ButtonGroup } from 'react-bootstrap';


const Channels = (props) => {
  const dispatch = useDispatch();
  //вытаскиваем данные текущие из пропсов
  const { channels, currentChannelId }  = props;
  //пишем функцию для генерации списка каналов
  const channelsGenerator = (channel) => {
    //логика новых каналов
    if (channel.removable) {
      return (
        <li className="nav-item w-100" key={channel.id}>
          <ButtonGroup role="group" className="d-flex dropdown">
          </ButtonGroup>
        </li>
      )
    }
    //логика дефолтных каналов, с проверкой текущего активного канала и действием на клик, меняющего текущий канал
    return (
      <li className="nav-item w-100" key={channel.id}>
        <Button variant={channel.id === currentChannelId ? `secondary` : `light`}
          id={channel.id} className="w-100 rounded-0 text-start" onClick={() => dispatch(currentChannelIdActions.updateId(channel.id))}>
            <span className="me-1">#</span>
            {channel.name}
        </Button>
      </li>
    )
  }
  // верстка всего блока каналов, вместо плюса растровая картинка с координатами, для списка
  // в map передается наша функция генератов и в нее каждый канал из стора для обработки
  return (
    <div className="col-4 col-md-2 border-end px-0 bg-light flex-column h-100 d-flex">
      <div className="d-flex mt-1 justify-content-between mb-2 ps-4 pe-2 p-4">
        <b>Каналы</b>
        <Button variant="text-primary" className="p-0 btn-group-vertical">
          <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 16 16" width="20" height="20" fill="currentColor">
            <path d="M14 1a1 1 0 0 1 1 1v12a1 1 0 0 1-1 1H2a1 1 0 0 1-1-1V2a1 1 0 0 1 1-1h12zM2 0a2 2 0 0 0-2 2v12a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V2a2 2 0 0 0-2-2H2z"></path>
            <path d="M8 4a.5.5 0 0 1 .5.5v3h3a.5.5 0 0 1 0 1h-3v3a.5.5 0 0 1-1 0v-3h-3a.5.5 0 0 1 0-1h3v-3A.5.5 0 0 1 8 4z"></path>
          </svg>
          <span className="visually-hidden">+</span>
        </Button>
      </div>
      <ul id="channel-box" className="nav flex-column nav-pills nav-fill px-2 mb-3 overflow-auto h-100 d-block">
        {channels.map((channel) => channelsGenerator(channel))}
      </ul>
    </div>
  );
};

export default Channels;
