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
      builder.addCase(channelsActions.removeChannel, (state, action) => {
        if(state.currentChannelId === action.payload.id) {
          state.currentChannelId = 1;
        }
      })
      builder.addCase(channelsActions.addChannel, (state, action) => {
        const curId = action.payload.id;
        state.currentChannelId = curId;
      })
    }
  });

export const { actions } = currentChannelIdSlice;

export default currentChannelIdSlice.reducer;