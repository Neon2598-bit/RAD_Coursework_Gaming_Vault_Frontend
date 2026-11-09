import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import * as backlogApi from "../api/backlogApi";
import type { BacklogItem, BacklogStatus } from "../types";
import { getErrorMessage } from "../utils/getErrorMessage";
import { deactivateAccount, forceLogout, logoutUser } from "./authSlice";

interface BacklogState {
  items: BacklogItem[];
  loaded: boolean;
  loading: boolean;
  error: string | null;
}

const initialState: BacklogState = { items: [], loaded: false, loading: false, error: null };

export const fetchBacklog = createAsyncThunk<BacklogItem[], void, { rejectValue: string }>(
  "backlog/fetch",
  async (_, { rejectWithValue, signal }) => {
    try {
      return await backlogApi.getMyBacklog(signal);
    } catch (error) {
      return rejectWithValue(getErrorMessage(error));
    }
  }
);

export const addToBacklog = createAsyncThunk<
  BacklogItem,
  { gameId: string; status: BacklogStatus },
  { rejectValue: string }
>("backlog/add", async ({ gameId, status }, { rejectWithValue }) => {
  try {
    return await backlogApi.addToBacklog(gameId, status);
  } catch (error) {
    return rejectWithValue(getErrorMessage(error));
  }
});

export const updateBacklogStatus = createAsyncThunk<
  BacklogItem,
  { id: string; status: BacklogStatus },
  { rejectValue: string }
>("backlog/updateStatus", async ({ id, status }, { rejectWithValue }) => {
  try {
    return await backlogApi.updateBacklogStatus(id, status);
  } catch (error) {
    return rejectWithValue(getErrorMessage(error));
  }
});

export const removeFromBacklog = createAsyncThunk<string, string, { rejectValue: string }>(
  "backlog/remove",
  async (id, { rejectWithValue }) => {
    try {
      await backlogApi.removeFromBacklog(id);
      return id;
    } catch (error) {
      return rejectWithValue(getErrorMessage(error));
    }
  }
);

const reset = () => initialState;

const backlogSlice = createSlice({
  name: "backlog",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchBacklog.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchBacklog.fulfilled, (state, action) => {
        state.loading = false;
        state.loaded = true;
        state.items = action.payload;
      })
      .addCase(fetchBacklog.rejected, (state, action) => {
        if (action.meta.aborted) return;
        state.loading = false;
        state.error = action.payload ?? "Could not load your backlog";
      })
      .addCase(addToBacklog.fulfilled, (state, action) => {
        state.items = [action.payload, ...state.items.filter((item) => item._id !== action.payload._id)];
      })
      .addCase(updateBacklogStatus.fulfilled, (state, action) => {
        state.items = [action.payload, ...state.items.filter((item) => item._id !== action.payload._id)];
      })
      .addCase(removeFromBacklog.fulfilled, (state, action) => {
        state.items = state.items.filter((item) => item._id !== action.payload);
      })
      .addCase(logoutUser.fulfilled, reset)
      .addCase(deactivateAccount.fulfilled, reset)
      .addCase(forceLogout, reset);
  },
});

export default backlogSlice.reducer;
