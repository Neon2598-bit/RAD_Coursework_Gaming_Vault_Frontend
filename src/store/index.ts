import { configureStore } from "@reduxjs/toolkit";
import authReducer, { forceLogout } from "./authSlice";
import gamesReducer from "./gamesSlice";
import reviewsReducer from "./reviewsSlice";
import backlogReducer from "./backlogSlice";
import dashboardReducer from "./dashboardSlice";
import { setAuthFailureHandler } from "../api/axios";

export const store = configureStore({
  reducer: {
    auth: authReducer,
    games: gamesReducer,
    reviews: reviewsReducer,
    backlog: backlogReducer,
    dashboard: dashboardReducer,
  },
});

setAuthFailureHandler(() => store.dispatch(forceLogout()));

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
