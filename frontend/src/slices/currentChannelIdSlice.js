import { createSlice } from '@reduxjs/toolkit';

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
  });

export const { actions } = currentChannelIdSlice;

export default currentChannelIdSlice.reducer;