import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { actions as channelsActions } from './channelsSlice.js';

export const addMessageThunk = createAsyncThunk(
  'messagesInfo/addMessage',
  async ({newMessageData, socket}) => {
      socket.emit('newMessage', newMessageData);
  },
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