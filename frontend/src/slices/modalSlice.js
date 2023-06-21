import { createSlice } from '@reduxjs/toolkit';
import { actions as channelsActions } from './channelsSlice.js';
import { addMessageThunk } from './messagesSlice.js';
import { addChannelThunk, renameChannelThunk, removeChannelThunk } from './channelsSlice.js';

const initialState = {
  modalUi: {
    isAddChannelModalShow: false,
    isRemoveChannelModalShow: false,
    isRenameChannelModalShow: false,
    currentWorkingId: 1,
    toastMessage: null,
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
      changeToastMessage: (state, { payload }) => {
        state.modalUi.toastMessage = payload;
      },
    },
    //сброс текущего канала с которым работаем при удалении канала
    extraReducers: (builder) => {
      builder.addCase(channelsActions.removeChannel, (state) => {
        state.modalUi.currentWorkingId = 1;
      })
    /* добавляем сообщение при ошибке для модального окна с предупреждениями, при ошибке в mainPage
    будет срабатывать useEffect на изменение toastMessage и по сообщению в нем будет подтягиваться текст ошибки из i18n
    через функцию в useEffect */
      .addCase(addMessageThunk.rejected, (state) => {
        state.modalUi.toastMessage = 'forms.errors.networkError';
      })
      .addCase(addChannelThunk.rejected, (state) => {
        state.modalUi.toastMessage = 'forms.errors.networkError';
      })
      .addCase(renameChannelThunk.rejected, (state) => {
        state.modalUi.toastMessage = 'forms.errors.networkError';
      })
      .addCase(removeChannelThunk.rejected, (state) => {
        state.modalUi.toastMessage = 'forms.errors.networkError';
      })
    }
  });

export const { actions } = modalSlice;

export default modalSlice.reducer;