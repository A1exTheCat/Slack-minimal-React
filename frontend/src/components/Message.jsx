import { useContext, useEffect } from 'react';
import { AuthorizationContext } from './AuthorizationContext.jsx';
import axios from 'axios';
import { useDispatch, useSelector } from 'react-redux';

import { actions as channelsActions } from '../slices/channelsSlice.js';
import { actions as messagesActions } from '../slices/messagesSlice.js';
import { actions as currentChannelIdActions } from '../slices/currentChannelIdSlice.js';
import { Button, ButtonGroup } from 'react-bootstrap';


const Message = (props) => {
  const dispatch = useDispatch();
  //вытаскиваем данные текущие из пропсов
  const { message } = props;
  const { body, username, id}  = message;

  return (
    <div className="text-break mb-2" key={id}>
      <b>{username}</b>: {body}
    </div>
  )

};

export default Message;
