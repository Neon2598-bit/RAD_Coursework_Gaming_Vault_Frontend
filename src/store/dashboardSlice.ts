import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import * as dashboardApi from "../api/dashboardApi";
import type { DashboardData } from "../types";
import { getErrorMessage } from "../utils/getErrorMessage";
import { deactivateAccount, forceLogout, logoutUser } from "./authSlice";

interface DashboardState {
  data: DashboardData | null;
  loading: boolean;
  error: string | null;
}

const initialState: DashboardState = { data: null, loading: false, error: null };

export const fetchDashboard = createAsyncThunk<DashboardData, void, { rejectValue: string }>(
  "dashboard/fetch",
  async (_, { rejectWithValue, signal }) => {
    try {
      return await dashboardApi.getDashboard(signal);
    } catch (error) {
      return rejectWithValue(getErrorMessage(error));
    }
  }
);

const reset = () => initialState;

const dashboardSlice = createSlice({
  name: "dashboard",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchDashboard.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchDashboard.fulfilled, (state, action) => {
        state.loading = false;
        state.data = action.payload;
      })
      .addCase(fetchDashboard.rejected, (state, action) => {
        if (action.meta.aborted) return;
        state.loading = false;
        state.error = action.payload ?? "Could not load your dashboard";
      })
      .addCase(logoutUser.fulfilled, reset)
      .addCase(deactivateAccount.fulfilled, reset)
      .addCase(forceLogout, reset);
  },
});

export default dashboardSlice.reducer;
