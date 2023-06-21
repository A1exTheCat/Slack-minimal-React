import { Button, Modal, Form  } from 'react-bootstrap';
import { useDispatch, useSelector } from 'react-redux';
import { useRef, useEffect, useContext } from 'react';
import SocketContext from './SocketContext.jsx';
import { actions as modalActions } from '../slices/modalSlice.js';
import { addChannelThunk, renameChannelThunk, removeChannelThunk } from '../slices/channelsSlice.js'
import { useFormik } from 'formik';
import * as Yup from 'yup';
import { useTranslation } from 'react-i18next';

  //Модальное окно добавления нового канала
export const AddChannelModal = () => {
  // подтягиваем сокет и прописываем dispatch для использования редакса
  const dispatch = useDispatch();
  const { t } = useTranslation();
  const socket = useContext(SocketContext);
  //подтягиваем из стора значение статуса показа модалки и все существующие каналы
  const isAddChannelShow = useSelector((state) => state.modalReducer.modalUi.isAddChannelModalShow);
  const channels = useSelector((state) => state.channelsReducer.channels);
  /* действие при закрытии формы, меняем статус показа модалки в сторе
   и используем метод formik для сброса формы */
  const handleClose = () => {
    dispatch(modalActions.isAddShow(false));
    formik.resetForm();
  };
  // схема валидации, из особенного пункт test, в котором проводится проверка на отсутствие канала с таким именем
  const newChannelNameSchema = Yup.object().shape({
    name: Yup.string()
      .min(3, t('forms.errors.symbolsError'))
      .max(20, t('forms.errors.symbolsError'))
      .required(t('forms.errors.requiredError'))
      .test('is-uniqe', t('forms.errors.uniqeNameErrorModal'), (value) => {
        const isChannelExist = channels.find((channel) => channel.name === value);
        return (isChannelExist === undefined)
      }),
  });
  /* экземпляр формика, из особенного - отключаем реакцию на валидации на изменения и на блюр, на сабмит отправляем данные в thunk и 
    вызываем функцию закрытия модального окна */
  const formik = useFormik({
    initialValues: {
      name:"",
    },
    validationSchema: newChannelNameSchema,
    validateOnBlur: false,
    validateOnChange: false,
    onSubmit: (values) => {
      const newChannelData = { ...values };
      dispatch(addChannelThunk({ newChannelData, socket }));
      handleClose();
    },
  });
  /*Модальное окно рендерится или не рендерится в зависимости от атрибута show, который берется из 
  стора, по умолчанию который false 
  прописываем атрибут is-invalid в зависимости от наличия ошибок и блок с ошибкой ниже тоже*/
  return (
    <Modal show={isAddChannelShow} onHide={handleClose} centered>
      <Modal.Header closeButton>
        <Modal.Title>{t('modals.addChannel')}</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <Form onSubmit={formik.handleSubmit}>
          <Form.Control
            type="text"
            id="name"
            placeholder=""
            autoFocus
            name="name"
            className={`mb-2 ${formik.errors.name ? 'is-invalid' : ''}`}
            onChange={formik.handleChange}
            value={formik.values.name}
          />
          {formik.errors.name ? (
            <div className="invalid-feedback">
              {formik.errors.name}
            </div>
          ) : null}
          <div className="d-flex justify-content-end">
            <Button variant="secondary" className="me-2" onClick={handleClose}>
              {t('modals.cancel')}
            </Button>
            <Button variant="primary" type="button" onClick={formik.handleSubmit}>
              {t('modals.send')}
            </Button>
          </div>
        </Form>
      </Modal.Body>
    </Modal>
  )
};
// модалка без формы на удаление канала
export const RemoveModal = () => {
  const dispatch = useDispatch();
  const { t } = useTranslation();
  const socket = useContext(SocketContext);
  // подтягиваем данные для активации окна и текущий канал с которым работаем
  const isRemoveShow = useSelector((state) => state.modalReducer.modalUi.isRemoveChannelModalShow);
  const currentRemovingId = useSelector((state) => state.modalReducer.modalUi.currentWorkingId);
  // фукция закрытия
  const handleClose = () => {
    dispatch(modalActions.isRemoveShow(false));
  };
  /* функция сабмита, передаем текущий айди канала с которым работаем,
   он записывается в стор предварительно при нажатии кнопки открытия модалки
   в блоке каналов. После отправлем данные в thunk вместе с сокетом */
  const handleSubmit = () => {
    const removedChannelId = { id: currentRemovingId };
    dispatch(removeChannelThunk({ removedChannelId, socket }));
    handleClose();
  };

  return (
    <Modal show={isRemoveShow} onHide={handleClose} centered>
      <Modal.Header closeButton>
        <Modal.Title>{t('modals.removeChannel')}</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <p className="lead">{t('modals.sure')}</p>
          <div className="d-flex justify-content-end">
          <Button variant="secondary" className="me-2" onClick={handleClose}>
            {t('modals.cancel')}
          </Button>
          <Button variant="danger" onClick={handleSubmit}>
            {t('modals.remove')}
          </Button>
        </div>
      </Modal.Body>
    </Modal>
  )
};

export const RenameModal = () => {
  const dispatch = useDispatch();
  const { t } = useTranslation();
  const socket = useContext(SocketContext);
  /* подтягиваем данные для активации окна и текущий канал с которым работаеми реф для выделения имени
    при активации окна*/
  const isRenameShow = useSelector((state) => state.modalReducer.modalUi.isRenameChannelModalShow);
  const currentRenamingId = useSelector((state) => state.modalReducer.modalUi.currentWorkingId);
  const channels = useSelector((state) => state.channelsReducer.channels);
  const currentChannel = channels.find((channel) => channel.id === currentRenamingId);
  const inputRef = useRef(null);
  /*функция закрытия окна с ресетом формы по таймингу, так как если сделать сразу,
   то мелькает в последний момент форма и выглядит как глитч */
  const handleClose = () => {
    dispatch(modalActions.isRenameShow(false));
    setTimeout(() => formik.resetForm(), 300);
  };
  // схема такая же как при создании нового канала
  const newChannelNameSchema = Yup.object().shape({
    name: Yup.string()
      .min(3, t('forms.errors.symbolsError'))
      .max(20, t('forms.errors.symbolsError'))
      .required(t('forms.errors.requiredError'))
      .test('is-uniqe', t('forms.errors.uniqeNameErrorModal'), (value) => {
        const isChannelExist = channels.find((channel) => channel.name === value);
        return (isChannelExist === undefined)
      }),
  });
  /*В формике отключаем валидацию при изменении и блюре, важная деталь, мы устанавливаем  enableReinitialize: true,
  потому что формик инициалирируется один раз при первом рендере и потом если не прописать эту настройку
  все время будет в форме name текущего канала на момент инициализации. Если же прописать эту настройку,
  то будем каждый раз подтягиваться нвоое значение*/
  const formik = useFormik({
    initialValues: {
      name: currentChannel.name,
    },
    validationSchema: newChannelNameSchema,
    enableReinitialize: true,
    validateOnBlur: false,
    validateOnChange: false,
    onSubmit: (values) => {
      const newChannelData = { id: currentRenamingId, ...values };
      dispatch(renameChannelThunk({ newChannelData, socket }));
      handleClose();
    },
  });
  // выделение текста при активации формы
  useEffect(() => {
    if (isRenameShow) {
      inputRef.current.select();
    }
  }, [isRenameShow]);
  // вывод ошибок по тому же принципу как в предыдущем модальном окне добавления нового канала
  return (
    <Modal show={isRenameShow} onHide={handleClose} centered>
      <Modal.Header closeButton>
        <Modal.Title>{t('modals.renameChannel')}</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <Form onSubmit={formik.handleSubmit}>
             <Form.Control
              ref={inputRef}
              id="name"
              type="text"
              placeholder=""
              name="name"
              autoFocus
              className={`mb-2 ${formik.errors.name ? 'is-invalid' : ''}`}
              onChange={formik.handleChange}
              value={formik.values.name}
            />
            {formik.errors.name ? (
              <div className="invalid-feedback">
                {formik.errors.name}
              </div>
            ) : null}
        </Form>
        <div className="d-flex justify-content-end">
          <Button variant="secondary" className="me-2" onClick={handleClose}>
            {t('modals.cancel')}
          </Button>
          <Button variant="primary" onClick={formik.handleSubmit}>
            {t('modals.send')}
          </Button>
        </div>
      </Modal.Body>
    </Modal>
  )
};