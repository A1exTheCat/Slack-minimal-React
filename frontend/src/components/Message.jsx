import filter from 'leo-profanity';

const Message = (props) => {
  // вытаскиваем данные текущие из пропсов
  const { message, key } = props;
  const { body, username } = message;
  // подключаем два словаря для цензурирования и фильтруем сообщения
  filter.clearList();
  filter.add(filter.getDictionary('en'));
  filter.add(filter.getDictionary('ru'));

  return (
    <div className="text-break mb-2" key={key}>
      <b>{username}</b>
      :
      {` ${filter.clean(body)}`}
    </div>
  );
};

export default Message;
