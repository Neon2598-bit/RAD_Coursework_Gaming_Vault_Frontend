import { configureStore } from "@reduxjs/toolkit";
import authReducer, { forceLogout } from "./authSlice";
import { setAuthFailureHandler } from "../api/axios";

export const store = configureStore({
  reducer: {
    auth: authReducer,
  },
});

setAuthFailureHandler(() => store.dispatch(forceLogout()));

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
