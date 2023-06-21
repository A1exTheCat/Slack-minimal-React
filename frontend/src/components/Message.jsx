const Message = (props) => {
  //вытаскиваем данные текущие из пропсов
  const { message } = props;
  const { body, username, id} = message;

  return (
    <div className="text-break mb-2" key={id}>
      <b>{username}</b>: {body}
    </div>
  )

};

export default Message;
