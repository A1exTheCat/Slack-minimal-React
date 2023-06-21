import filter from 'leo-profanity';

const Message = (props) => {
  //вытаскиваем данные текущие из пропсов
  const { message } = props;
  const { body, username, id} = message;
  //подключаем два словаря для цензурирования и фильтруем сообщения
  filter.clearList();
  filter.add(filter.getDictionary('en'))
  filter.add(filter.getDictionary('ru'))

  return (
    <div className="text-break mb-2" key={id}>
      <b>{username}</b>: {filter.clean(body)}
    </div>
  )

};

export default Message;
