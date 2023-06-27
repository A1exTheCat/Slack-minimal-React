import { useDispatch } from 'react-redux';
import { actions as modalActions } from '../slices/modalSlice.js';
import { actions as currentChannelIdActions } from '../slices/currentChannelIdSlice.js';
import { Button, ButtonGroup, Dropdown } from 'react-bootstrap';
import { useTranslation } from 'react-i18next';

const Channels = (props) => {
  const dispatch = useDispatch();
  const { t } = useTranslation();
  /* три функции по клику, которые меняют стейт для модальных окон
   на изменения в которых в свою очередь реагируют компоненты модальных окон
   и отображаются по нажатию, внутрь передаем id канала с которым идет работаб так как это не обязательно
   активный канал */
  const handleOpenAddModal = () => {
    dispatch(modalActions.isAddShow(true));
  };

  const handleOpenRemoveModal = (id) => {
    dispatch(modalActions.changeCurrentWorkingId(id));
    dispatch(modalActions.isRemoveShow(true));
  };

  const handleOpenRenameModal = (id) => {
    dispatch(modalActions.changeCurrentWorkingId(id));
    dispatch(modalActions.isRenameShow(true));
  };
  //вытаскиваем данные текущие из пропсов
  const { channels, currentChannelId }  = props;
  //пишем функцию для генерации списка каналов
  const channelsGenerator = (channel) => {
    //логика новых каналов
    if (channel.removable) {
      return (
        <li className="nav-item w-100" key={channel.id}>
          <Dropdown as={ButtonGroup} className="d-flex">
          <Button variant={channel.id === currentChannelId ? `secondary` : `light`}
            id={channel.id} className="w-100 rounded-0 text-start text-truncate" onClick={() => dispatch(currentChannelIdActions.updateId(channel.id))}>
            <span className="me-1">#</span>
            {channel.name}
          </Button>
              <Dropdown.Toggle variant={channel.id === currentChannelId ? `secondary` : `light`} as={Button} title=""  id={channel.id}>
                <span className="visually-hidden">Управление каналом</span>
              </Dropdown.Toggle>
              <Dropdown.Menu>
                <Dropdown.Item eventKey="1" onClick={() => handleOpenRemoveModal(channel.id)}>{t('mainPage.remove')}</Dropdown.Item>
                <Dropdown.Item eventKey="2" onClick={() => handleOpenRenameModal(channel.id)}>{t('mainPage.rename')}</Dropdown.Item>
              </Dropdown.Menu>
          </Dropdown>
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
        <b>{t('mainPage.channels')}</b>
        <Button variant="text-primary" className="p-0 btn-group-vertical" onClick={handleOpenAddModal}>
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
