/* eslint-disable no-param-reassign */
/* eslint-disable import/no-cycle */

import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { actions as modalActions } from './modalSlice.js';
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
    });
  },
);

export const renameChannelThunk = createAsyncThunk(
  'channelInfo/renameChannel',
  async ({ newChannelData, socket, dispatch }) => {
    socket.emit('renameChannel', newChannelData, async (response) => {
      if (response.status !== 'ok') {
        dispatch(modalActions.changeToastMessage('forms.errors.networkError'));
      }
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
    addTempChannel: (state, { payload }) => {
      const tempChannel = { ...payload, id: 0, removable: true };
      console.log(tempChannel);
      state.channels.push(tempChannel);
    },
    addChannel: (state, { payload }) => {
      const tempChannel = state.channels.find((c) => c.id === 0);
      if (tempChannel && tempChannel.name === payload.name) {
        tempChannel.id = payload.id;
      } else {
        state.channels.push(payload);
      }
    },
    setUpChannels: (state, { payload }) => {
      state.channels = payload;
    },
    renameChannel: (state, { payload }) => {
      const currentChannel = state.channels.find((channel) => channel.id === payload.id);
      if (currentChannel.name !== payload.name) {
        currentChannel.name = payload.name;
      }
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
