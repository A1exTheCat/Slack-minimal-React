import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { actions as modalActions } from '../slices/modalSlice.js';
/* Чанки устроены так, что от вервера получается ответ на любой запрос "ок" или нет,
он проверяется, и на его основе меняем стейт для вывода сообщения о успехе или ошибке,
при этом в дополнительных редьюсерахх тоже есть обработка rejected для ошибок с соединением
и реакции на них */
export const addChannelThunk = createAsyncThunk(
  'channelInfo/newChannel',
  async ({ newChannelData, socket, dispatch }) => {
    socket.emit('newChannel', newChannelData, async (response) => {
      if (response.status !== 'ok') {
        dispatch(modalActions.changeToastMessage('forms.errors.networkError'));
      }
      dispatch(modalActions.changeToastMessage('toastify.addChannel'));
    });
  },
);

export const renameChannelThunk = createAsyncThunk(
  'channelInfo/renameChannel',
  async ({ newChannelData, socket, dispatch }) => {
    socket.emit('renameChannel', newChannelData, async (response) => {
      if(response.status !== 'ok') {
        dispatch(modalActions.changeToastMessage('forms.errors.networkError'));
      }
      dispatch(modalActions.changeToastMessage('toastify.renameChannel'));
    });
  },
);

export const removeChannelThunk = createAsyncThunk(
  'channelInfo/removeChannel',
  async ({ removedChannelId, socket, dispatch }) => {
    socket.emit('removeChannel', removedChannelId, async (response) => {
      if (response.status !== 'ok') {
        dispatch(modalActions.changeToastMessage('forms.errors.networkError'));
      }
      dispatch(modalActions.changeToastMessage('toastify.removeChannel'));
    });
  },
);


const initialState = {
  channels: [
    {
      id: 1,
      name: 'general',
      removable: false,
    },
  ],
};

const channelsSlice = createSlice({
    name: 'channels',
    initialState,
    reducers: {
      addChannel: (state, { payload }) => {
        state.channels.push(payload);
      },
      setUpChannels: (state, { payload }) => {
        state.channels = payload;
      },
      renameChannel: (state, { payload }) => {
        const currentChannel = state.channels.find((channel) => channel.id === payload.id);
        currentChannel.name = payload.name;
      },
      removeChannel: (state, { payload }) => {
        const { id: channelId } = payload;
        const filteredState = state.channels.filter((channel) => channel.id !== channelId);
        state.channels = filteredState;
      },
    },
  });

export const { actions } = channelsSlice;

export default channelsSlice.reducer;