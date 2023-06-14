import { createSlice } from '@reduxjs/toolkit';

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
  });

export const { actions } = modalSlice;

export default modalSlice.reducer;