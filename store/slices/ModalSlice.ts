import { createSlice } from "@reduxjs/toolkit";

export interface ModalSliceState {
    isOpen: boolean,
    isViewOpen: boolean;
}
const initialState: ModalSliceState = {
    isOpen: false,
    isViewOpen: false,
};

const modalSlice = createSlice({
  name: "module",
  initialState,
  reducers: {
    openModals: (state) => {
        state.isOpen = true
    },
    closeModal: (state) => {
        state.isOpen = false
    },
    openView: (state) => {
        state.isViewOpen = true
    },
    closeView: (state) => {
        state.isViewOpen = false
    },
  },
});

  

export const { openModals, closeModal, openView, closeView } = modalSlice.actions;
export default modalSlice.reducer;