import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { actions as channelsActions } from './channelsSlice.js';
import { actions as modalActions } from '../slices/modalSlice.js';
/*Чанки устроены так, что от вервера получается ответ на любой запрос "ок" или нет,
он проверяется, и на его основе меняем стейт для вывода сообщения о успехе или ошибке,
при этом в дополнительных редьюсерахх тоже есть обработка rejected для ошибок с соединением
и реакции на них */
export const addMessageThunk = createAsyncThunk(
  'messagesInfo/addMessage',
  async ({ newMessageData, socket, dispatch }) => {
    socket.emit('newMessage', newMessageData, async (response) => {
      if(response.status !== 'ok') {
        dispatch(modalActions.changeToastMessage('forms.errors.networkError'));
      };
    })
  }
);

const initialState = {
  messages: [],
};

const messagesSlice = createSlice({
    name: 'messages',
    initialState,
    reducers: {
      addMessage: (state, { payload }) => {
        state.messages.push(payload);
      },
      setUpMessages: (state, { payload }) => {
        state.messages = payload;
      },
    },
    //удаление ненужных сообщений после удаления чата
    extraReducers: (builder) => {
      builder.addCase(channelsActions.removeChannel, (state, action) => {
        const delId = action.payload.id;
        const filteredMessages = state.messages.filter((m) => m.id !== delId);
        state.messages = filteredMessages;
      })
    }
  });

export const { actions } = messagesSlice;

export default messagesSlice.reducer;