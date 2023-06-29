import { createSlice } from '@reduxjs/toolkit';
import { actions as channelsActions } from './channelsSlice.js';

const initialState = {
  currentChannelId: 1,
};

const currentChannelIdSlice = createSlice({
  name: 'currentChannelId',
  initialState,
  reducers: {
    updateId: (state, { payload }) => {
      state.currentChannelId = payload;
    },
  },
  extraReducers: (builder) => {
    // переключение на канал general если удален текущий канал
    builder.addCase(channelsActions.removeChannel, (state, action) => {
      if (state.currentChannelId === action.payload.id) {
        state.currentChannelId = 1;
      }
    }),
    // переключение на новый канал при создании
    builder.addCase(channelsActions.addTempChannel, (state) => {
      state.currentChannelId = 0;
    }),
    builder.addCase(channelsActions.addChannel, (state, action) => {
      const { id } = action.payload;
      if (state.currentChannelId === 0) {
        state.currentChannelId = id;
      }
    }),
  },
});

export const { actions } = currentChannelIdSlice;

export default currentChannelIdSlice.reducer;