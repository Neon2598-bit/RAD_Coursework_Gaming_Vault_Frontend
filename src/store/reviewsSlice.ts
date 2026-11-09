import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import * as reviewApi from "../api/reviewApi";
import type { MyReview, Review } from "../types";
import { getErrorMessage } from "../utils/getErrorMessage";
import { deactivateAccount, forceLogout, logoutUser } from "./authSlice";

interface ReviewsState {
  gameId: string | null;
  items: Review[];
  total: number;
  pages: number;
  averageRating: number;
  loading: boolean;
  error: string | null;
  myReviews: MyReview[];
  myLoaded: boolean;
  myLoading: boolean;
  myError: string | null;
}

const initialState: ReviewsState = {
  gameId: null,
  items: [],
  total: 0,
  pages: 0,
  averageRating: 0,
  loading: false,
  error: null,
  myReviews: [],
  myLoaded: false,
  myLoading: false,
  myError: null,
};

export const fetchGameReviews = createAsyncThunk<
  Awaited<ReturnType<typeof reviewApi.getGameReviews>>,
  { gameId: string; page: number },
  { rejectValue: string }
>("reviews/fetchForGame", async ({ gameId, page }, { rejectWithValue, signal }) => {
  try {
    return await reviewApi.getGameReviews(gameId, page, signal);
  } catch (error) {
    return rejectWithValue(getErrorMessage(error));
  }
});

export const fetchMyReviews = createAsyncThunk<MyReview[], void, { rejectValue: string }>(
  "reviews/fetchMine",
  async (_, { rejectWithValue, signal }) => {
    try {
      return await reviewApi.getMyReviews(signal);
    } catch (error) {
      return rejectWithValue(getErrorMessage(error));
    }
  }
);

export const createReview = createAsyncThunk<
  Review,
  { gameId: string; rating: number; comment: string },
  { rejectValue: string }
>("reviews/create", async ({ gameId, rating, comment }, { rejectWithValue }) => {
  try {
    return await reviewApi.createReview(gameId, { rating, comment });
  } catch (error) {
    return rejectWithValue(getErrorMessage(error));
  }
});

export const updateReview = createAsyncThunk<
  Review,
  { id: string; rating: number; comment: string },
  { rejectValue: string }
>("reviews/update", async ({ id, rating, comment }, { rejectWithValue }) => {
  try {
    return await reviewApi.updateReview(id, { rating, comment });
  } catch (error) {
    return rejectWithValue(getErrorMessage(error));
  }
});

export const deleteReview = createAsyncThunk<string, string, { rejectValue: string }>(
  "reviews/delete",
  async (id, { rejectWithValue }) => {
    try {
      await reviewApi.deleteReview(id);
      return id;
    } catch (error) {
      return rejectWithValue(getErrorMessage(error));
    }
  }
);

const clearMyReviews = (state: ReviewsState) => {
  state.myReviews = [];
  state.myLoaded = false;
  state.myError = null;
};

const reviewsSlice = createSlice({
  name: "reviews",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchGameReviews.pending, (state, action) => {
        state.loading = true;
        state.error = null;
        if (state.gameId !== action.meta.arg.gameId) {
          state.gameId = action.meta.arg.gameId;
          state.items = [];
          state.total = 0;
          state.pages = 0;
          state.averageRating = 0;
        }
      })
      .addCase(fetchGameReviews.fulfilled, (state, action) => {
        state.loading = false;
        state.items = action.payload.reviews;
        state.total = action.payload.total;
        state.pages = action.payload.pages;
        state.averageRating = action.payload.averageRating;
      })
      .addCase(fetchGameReviews.rejected, (state, action) => {
        if (action.meta.aborted) return;
        state.loading = false;
        state.error = action.payload ?? "Could not load reviews";
      })
      .addCase(fetchMyReviews.pending, (state) => {
        state.myLoading = true;
        state.myError = null;
      })
      .addCase(fetchMyReviews.fulfilled, (state, action) => {
        state.myLoading = false;
        state.myLoaded = true;
        state.myReviews = action.payload;
      })
      .addCase(fetchMyReviews.rejected, (state, action) => {
        if (action.meta.aborted) return;
        state.myLoading = false;
        state.myError = action.payload ?? "Could not load your reviews";
      })
      .addCase(logoutUser.fulfilled, clearMyReviews)
      .addCase(deactivateAccount.fulfilled, clearMyReviews)
      .addCase(forceLogout, clearMyReviews);
  },
});

export default reviewsSlice.reducer;
