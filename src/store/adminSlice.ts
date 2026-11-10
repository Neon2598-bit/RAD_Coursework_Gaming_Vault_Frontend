import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import * as gameApi from "../api/gameApi";
import type { Game, GamePayload } from "../types";
import { getErrorMessage } from "../utils/getErrorMessage";
import { deactivateAccount, forceLogout, logoutUser } from "./authSlice";

interface AdminState {
  items: Game[];
  total: number;
  pages: number;
  loading: boolean;
  error: string | null;
  deleted: Game[];
  deletedLoaded: boolean;
  deletedError: string | null;
}

const initialState: AdminState = {
  items: [],
  total: 0,
  pages: 0,
  loading: false,
  error: null,
  deleted: [],
  deletedLoaded: false,
  deletedError: null,
};

export const fetchAdminGames = createAsyncThunk<
  Awaited<ReturnType<typeof gameApi.getGames>>,
  { search: string; page: number },
  { rejectValue: string }
>("admin/fetchGames", async ({ search, page }, { rejectWithValue, signal }) => {
  try {
    return await gameApi.getGames({ search, genre: "", platform: "", page }, signal);
  } catch (error) {
    return rejectWithValue(getErrorMessage(error));
  }
});

export const fetchDeletedGames = createAsyncThunk<Game[], void, { rejectValue: string }>(
  "admin/fetchDeleted",
  async (_, { rejectWithValue, signal }) => {
    try {
      return await gameApi.getDeletedGames(signal);
    } catch (error) {
      return rejectWithValue(getErrorMessage(error));
    }
  }
);

export const createGame = createAsyncThunk<Game, GamePayload, { rejectValue: string }>(
  "admin/create",
  async (payload, { rejectWithValue }) => {
    try {
      return await gameApi.createGame(payload);
    } catch (error) {
      return rejectWithValue(getErrorMessage(error));
    }
  }
);

export const updateGame = createAsyncThunk<Game, { id: string; payload: GamePayload }, { rejectValue: string }>(
  "admin/update",
  async ({ id, payload }, { rejectWithValue }) => {
    try {
      return await gameApi.updateGame(id, payload);
    } catch (error) {
      return rejectWithValue(getErrorMessage(error));
    }
  }
);

export const deleteGame = createAsyncThunk<string, string, { rejectValue: string }>(
  "admin/delete",
  async (id, { rejectWithValue }) => {
    try {
      await gameApi.deleteGame(id);
      return id;
    } catch (error) {
      return rejectWithValue(getErrorMessage(error));
    }
  }
);

export const restoreGame = createAsyncThunk<Game, string, { rejectValue: string }>(
  "admin/restore",
  async (id, { rejectWithValue }) => {
    try {
      return await gameApi.restoreGame(id);
    } catch (error) {
      return rejectWithValue(getErrorMessage(error));
    }
  }
);

const reset = () => initialState;

const adminSlice = createSlice({
  name: "admin",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchAdminGames.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchAdminGames.fulfilled, (state, action) => {
        state.loading = false;
        state.items = action.payload.games;
        state.total = action.payload.total;
        state.pages = action.payload.pages;
      })
      .addCase(fetchAdminGames.rejected, (state, action) => {
        if (action.meta.aborted) return;
        state.loading = false;
        state.error = action.payload ?? "Could not load games";
      })
      .addCase(fetchDeletedGames.pending, (state) => {
        state.deletedError = null;
      })
      .addCase(fetchDeletedGames.fulfilled, (state, action) => {
        state.deletedLoaded = true;
        state.deleted = action.payload;
      })
      .addCase(fetchDeletedGames.rejected, (state, action) => {
        if (action.meta.aborted) return;
        state.deletedError = action.payload ?? "Could not load deleted games";
      })
      .addCase(restoreGame.fulfilled, (state, action) => {
        state.deleted = state.deleted.filter((game) => game._id !== action.payload._id);
      })
      .addCase(logoutUser.fulfilled, reset)
      .addCase(deactivateAccount.fulfilled, reset)
      .addCase(forceLogout, reset);
  },
});

export default adminSlice.reducer;
