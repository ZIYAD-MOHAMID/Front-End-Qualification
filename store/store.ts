"use client"
import { configureStore } from "@reduxjs/toolkit";
import bordReducer  from "./slices/BordSlice";
import modalReducer from "./slices/ModalSlice";

export const store = configureStore({
    reducer: {
      bord: bordReducer, 
      module: modalReducer, 
  },
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
