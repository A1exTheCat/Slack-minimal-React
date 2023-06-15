import { createSlice } from '@reduxjs/toolkit';
import { actions as channelsActions } from './channelsSlice.js';

const initialState = {
  modalUi: {
    isAddChannelModalShow: false,
    isRemoveChannelModalShow: false,
    isRenameChannelModalShow: false,
    currentWorkingId: 1,
  },
};

const modalSlice = createSlice({
    name: 'modalUi',
    initialState,
    reducers: {
      isAddShow: (state, { payload }) => {
        state.modalUi.isAddChannelModalShow = payload;
      },
      isRemoveShow: (state, { payload }) => {
        state.modalUi.isRemoveChannelModalShow = payload;
      },
      isRenameShow: (state, { payload }) => {
        state.modalUi.isRenameChannelModalShow = payload;
      },
      changeCurrentWorkingId: (state, { payload }) => {
        state.modalUi.currentWorkingId = payload;
      },
    },
    extraReducers: (builder) => {
      builder.addCase(channelsActions.removeChannel, (state) => {
        state.modalUi.currentWorkingId = 1;
      })
    }
  });

export const { actions } = modalSlice;

export default modalSlice.reducer;