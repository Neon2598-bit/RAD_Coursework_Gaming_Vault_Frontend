import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import * as gameApi from "../api/gameApi";
import type { Game, GameFilters, GamesPage } from "../types";
import { getErrorMessage } from "../utils/getErrorMessage";

interface GamesState {
  items: Game[];
  total: number;
  page: number;
  pages: number;
  loading: boolean;
  error: string | null;
  current: Game | null;
  currentLoading: boolean;
  currentError: string | null;
}

const initialState: GamesState = {
  items: [],
  total: 0,
  page: 1,
  pages: 0,
  loading: false,
  error: null,
  current: null,
  currentLoading: false,
  currentError: null,
};

export const fetchGames = createAsyncThunk<GamesPage, GameFilters, { rejectValue: string }>(
  "games/fetchAll",
  async (filters, { rejectWithValue, signal }) => {
    try {
      return await gameApi.getGames(filters, signal);
    } catch (error) {
      return rejectWithValue(getErrorMessage(error));
    }
  }
);

export const fetchGameById = createAsyncThunk<Game, string, { rejectValue: string }>(
  "games/fetchOne",
  async (id, { rejectWithValue, signal }) => {
    try {
      return await gameApi.getGameById(id, signal);
    } catch (error) {
      return rejectWithValue(getErrorMessage(error));
    }
  }
);

const gamesSlice = createSlice({
  name: "games",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchGames.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchGames.fulfilled, (state, action) => {
        state.loading = false;
        state.items = action.payload.games;
        state.total = action.payload.total;
        state.page = action.payload.page;
        state.pages = action.payload.pages;
      })
      .addCase(fetchGames.rejected, (state, action) => {
        if (action.meta.aborted) return;
        state.loading = false;
        state.error = action.payload ?? "Could not load games";
      })
      .addCase(fetchGameById.pending, (state) => {
        state.currentLoading = true;
        state.currentError = null;
      })
      .addCase(fetchGameById.fulfilled, (state, action) => {
        state.currentLoading = false;
        state.current = action.payload;
      })
      .addCase(fetchGameById.rejected, (state, action) => {
        if (action.meta.aborted) return;
        state.currentLoading = false;
        state.current = null;
        state.currentError = action.payload ?? "Could not load game";
      });
  },
});

export default gamesSlice.reducer;
