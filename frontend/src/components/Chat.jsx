import { useEffect, useRef } from 'react';
import { useTranslation } from 'react-i18next';
import Message from './Message';
import { ChatForm } from './Forms';

const Chat = (props) => {
  const { currentChannel, currentMessages } = props;
  const { t } = useTranslation();
  // Создаем реф для окна с сообщениями для перемотки к последнему сообщению
  const messagesBoxRef = useRef(null);
  /* useEffect для срабатывания перемотки к последнему сообщению при изменении
    входящего массива из пропсов текущих сообщенийб при этом в функции учтено,
    что если компонента пока нет, чат пуст, то ничего не будт происходить */
  useEffect(() => {
    if (messagesBoxRef.current) {
      messagesBoxRef.current.scrollTop = messagesBoxRef.current.scrollHeight;
    }
  }, [currentMessages]);

  return (
    <div className="col p-0 h-100">
      <div className="d-flex flex-column h-100">
        <div className="bg-light mb-4 p-3 shadow-sm small">
          <p className="m-0">
            <b>{`# ${currentChannel.name}`}</b>
          </p>
          <span className="text-muted">{t('mainPage.message', { count: currentMessages.length })}</span>
        </div>
        <div className="chat-messages overflow-auto px-5" id="messages-box" ref={messagesBoxRef}>
          {currentMessages.map((message) => <Message message={message} key={message.id} />)}
        </div>
        <div className="mt-auto px-5 py-3">
          <ChatForm />
        </div>
      </div>
    </div>
  );
};

export default Chat;
