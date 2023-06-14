import { createSlice } from '@reduxjs/toolkit';

const initialState = {
  channels: [{
    id: 1,
    name: 'general',
    removable: true,
  },
  {
    id: 2,
    name: 'aa',
    removable: false,
  }],
};

const channelsSlice = createSlice({
    name: 'channels',
    initialState,
    reducers: {
      addChannel: (state, { payload }) => {
        state.channels.push(payload);
      },
      setUpChannels: (state, { payload }) => {
        return;
        //state.channels = payload;
      },
      updateChannel: (state, { payload }) => {
        state.channels = { ...state.channels, payload };
      },
      removeChannel: (state, { payload }) => {
        const channelId = payload;
        const filteredState = state.channels.filter((channel) => channel.id !== channelId);
        state.channels = filteredState;
      },
    },
  });

export const { actions } = channelsSlice;

export default channelsSlice.reducer;