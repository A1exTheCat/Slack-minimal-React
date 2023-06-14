import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';

export const addMessage = createAsyncThunk(
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
  });

export const { actions } = messagesSlice;

export default messagesSlice.reducer;