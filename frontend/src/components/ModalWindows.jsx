import { Button, Modal, Form  } from 'react-bootstrap';
import { useDispatch, useSelector } from 'react-redux';
import { useRef, useEffect, useContext } from 'react';
import SocketContext from './SocketContext.jsx';
import { actions as modalActions } from '../slices/modalSlice.js';
import { addChannelThunk, renameChannelThunk, removeChannelThunk } from '../slices/channelsSlice.js'
import { useFormik } from 'formik';
import * as Yup from 'yup';

export const AddChannelModal = () => {
  const dispatch = useDispatch();
  const socket = useContext(SocketContext);
  const isAddChannelShow = useSelector((state) => state.modalReducer.modalUi.isAddChannelModalShow);
  const channels = useSelector((state) => state.channelsReducer.channels);

  const handleClose = () => {
    dispatch(modalActions.isAddShow(false));
    formik.resetForm();
  };

  const newChannelNameSchema = Yup.object().shape({
    name: Yup.string()
      .min(3, 'От 3 до 20 символов')
      .max(20, 'От 3 до 20 символов')
      .required('Обязательное поле')
      .test('is-uniqe', 'Должно быть уникальным', (value) => {
        const isChannelExist = channels.find((channel) => channel.name === value);
        return (isChannelExist === undefined)
      }),
  });

  const formik = useFormik({
    initialValues: {
      name:"",
    },
    validationSchema: newChannelNameSchema,
    validateOnBlur: false,
    validateOnChange: false,
    onSubmit: (values) => {
      const newChannelData = { ...values };
      console.log(newChannelData);
      dispatch(addChannelThunk({ newChannelData, socket }));
      handleClose();
    },
  });

  return (
    <Modal show={isAddChannelShow} onHide={handleClose} centered>
      <Modal.Header closeButton>
        <Modal.Title>Добавить канал</Modal.Title>
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
              Отменить
            </Button>
            <Button variant="primary" type="button" onClick={formik.handleSubmit}>
              Отправить
            </Button>
          </div>
        </Form>
      </Modal.Body>
    </Modal>
  )
};

export const RemoveModal = () => {
  const dispatch = useDispatch();
  const socket = useContext(SocketContext);
  const isRemoveShow = useSelector((state) => state.modalReducer.modalUi.isRemoveChannelModalShow);
  const currentRemovingId = useSelector((state) => state.modalReducer.modalUi.currentWorkingId);

  const handleClose = () => {
    dispatch(modalActions.isRemoveShow(false));
  };

  const handleSubmit = () => {
    const removedChannelId = { id: currentRemovingId };
    dispatch(removeChannelThunk({ removedChannelId, socket }));
    handleClose();
  };

  return (
    <Modal show={isRemoveShow} onHide={handleClose} centered>
      <Modal.Header closeButton>
        <Modal.Title>Удалить канал</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <p className="lead">Уверены?</p>
          <div className="d-flex justify-content-end">
          <Button variant="secondary" className="me-2" onClick={handleClose}>
            Отменить
          </Button>
          <Button variant="danger" onClick={handleSubmit}>
            Удалить
          </Button>
        </div>
      </Modal.Body>
    </Modal>
  )
};

export const RenameModal = () => {
  const dispatch = useDispatch();
  const socket = useContext(SocketContext);
  const isRenameShow = useSelector((state) => state.modalReducer.modalUi.isRenameChannelModalShow);
  const currentRenamingId = useSelector((state) => state.modalReducer.modalUi.currentWorkingId);
  const channels = useSelector((state) => state.channelsReducer.channels);
  const currentChannel = channels.find((channel) => channel.id === currentRenamingId);
  const inputRef = useRef(null);



  const handleClose = () => {
    dispatch(modalActions.isRenameShow(false));
    setTimeout(() => formik.resetForm(), 300);
  };

  const newChannelNameSchema = Yup.object().shape({
    name: Yup.string()
      .min(3, 'От 3 до 20 символов')
      .max(20, 'От 3 до 20 символов')
      .required('Обязательное поле')
      .test('is-uniqe', 'Должно быть уникальным', (value) => {
        const isChannelExist = channels.find((channel) => channel.name === value);
        return (isChannelExist === undefined)
      }),
  });

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

  useEffect(() => {
    if (isRenameShow) {
      inputRef.current.select();
    }
  }, [isRenameShow]);

  return (
    <Modal show={isRenameShow} onHide={handleClose} centered>
      <Modal.Header closeButton>
        <Modal.Title>Переименовать канал</Modal.Title>
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
            Отменить
          </Button>
          <Button variant="primary" onClick={formik.handleSubmit}>
            Отправить
          </Button>
        </div>
      </Modal.Body>
    </Modal>
  )
};