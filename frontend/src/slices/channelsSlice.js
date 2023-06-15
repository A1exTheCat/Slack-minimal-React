import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';

export const addChannelThunk = createAsyncThunk(
  'channelInfo/newChannel',
  async ({newChannelData, socket}) => {
    socket.emit('newChannel', newChannelData);
  },
);

export const renameChannelThunk = createAsyncThunk(
  'channelInfo/renameChannel',
  async ({newChannelData, socket}) => {
    socket.emit('renameChannel', newChannelData);
  },
);

export const removeChannelThunk = createAsyncThunk(
  'channelInfo/removeChannel',
  async ({removedChannelId, socket}) => {
    socket.emit('removeChannel', removedChannelId);
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