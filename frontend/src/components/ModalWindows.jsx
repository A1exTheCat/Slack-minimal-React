import {  Button, Modal, Form  } from 'react-bootstrap';
import { useDispatch, useSelector } from 'react-redux';
import SocketContext from './SocketContext.jsx';
import { useRef, useEffect } from 'react';
import { actions as modalActions } from '../slices/modalSlice.js';

export const AddChannelModal = () => {
  const dispatch = useDispatch();
  const isAddChannelShow = useSelector((state) => state.modalReducer.modalUi.isAddChannelModalShow);

  const handleClose = () => {
    dispatch(modalActions.isAddShow(false));
  };

  return (
    <Modal show={isAddChannelShow} onHide={handleClose} centered>
      <Modal.Header closeButton>
        <Modal.Title>Добавить канал</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <Form>
             <Form.Control
              type="email"
              placeholder=""
              autoFocus
              className="mb-2"
            />
        </Form>
        <div className="d-flex justify-content-end">
          <Button variant="secondary" className="me-2" onClick={handleClose}>
            Отменить
          </Button>
          <Button variant="primary" onClick={handleClose}>
            Отправить
          </Button>
        </div>
      </Modal.Body>
    </Modal>
  )
};

export const RemoveModal = () => {
  const dispatch = useDispatch();
  const isRemoveShow = useSelector((state) => state.modalReducer.modalUi.isRemoveChannelModalShow);
  const currentRemovingId = useSelector((state) => state.modalReducer.modalUi.currentWorkingId);

  const handleClose = () => {
    dispatch(modalActions.isRemoveShow(false));
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
          <Button variant="danger" onClick={handleClose}>
            Удалить
          </Button>
        </div>
      </Modal.Body>
    </Modal>
  )
};

export const RenameModal = () => {
  const dispatch = useDispatch();
  const isRenameShow = useSelector((state) => state.modalReducer.modalUi.isRenameChannelModalShow);
  const currentRenamingId = useSelector((state) => state.modalReducer.modalUi.currentWorkingId);
  const channels = useSelector((state) => state.channelsReducer.channels);
  const currentChannel = channels.find((channel) => channel.id === currentRenamingId);

  const inputRef = useRef(null);

  useEffect(() => {
    if (isRenameShow) {
      inputRef.current.select();
    }
  }, [isRenameShow]);

  const handleClose = () => {
    dispatch(modalActions.isRenameShow(false));
  };

  return (
    <Modal show={isRenameShow} onHide={handleClose} centered>
      <Modal.Header closeButton>
        <Modal.Title>Переименовать канал</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <Form>
             <Form.Control
              ref={inputRef}
              type="email"
              placeholder=""
              autoFocus
              className="mb-2"
              value={currentChannel.name}
            />
        </Form>
        <div className="d-flex justify-content-end">
          <Button variant="secondary" className="me-2" onClick={handleClose}>
            Отменить
          </Button>
          <Button variant="primary" onClick={handleClose}>
            Отправить
          </Button>
        </div>
      </Modal.Body>
    </Modal>
  )
};