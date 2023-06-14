import { useEffect, useRef } from 'react';
import Message from './Message';
import { ChatForm } from './Forms';

const Chat = (props) => {
  const { currentChannel, currentMessages } = props;

  const messagesBoxRef = useRef(null);

  useEffect(() => {
    if (messagesBoxRef.current) {
      messagesBoxRef.current.scrollTop = messagesBoxRef.current.scrollHeight;
    }
  }, [currentMessages]);

  return (
    <div className="col p-0 h-100">
      <div className="d-flex flex-column h-100">
        <div className="bg-light mb-4 p-3 shadow-sm small">
          <p className="m-0"><b># {currentChannel.name}</b></p>
          <span className="text-muted">{currentMessages.length} сообщений</span>
        </div>
        <div className="chat-messages overflow-auto px-5" id="messages-box" ref={messagesBoxRef}>
          {currentMessages.map((message) => <Message message={message} />)}
        </div>
        <div className="mt-auto px-5 py-3">
          <ChatForm />
        </div>
      </div>
    </div>
  );
};

export default Chat;
