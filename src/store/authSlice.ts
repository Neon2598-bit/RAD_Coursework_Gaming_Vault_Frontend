import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import * as authApi from "../api/authApi";
import type { User } from "../types";
import { clearTokens, getAccessToken, getRefreshToken, saveTokens } from "../utils/tokenStorage";
import { getErrorMessage } from "../utils/getErrorMessage";

interface AuthState {
  user: User | null;
  loading: boolean;
  initialized: boolean;
  error: string | null;
}

const initialState: AuthState = { user: null, loading: false, initialized: false, error: null };

export const registerUser = createAsyncThunk<
  User,
  { name: string; email: string; password: string },
  { rejectValue: string }
>("auth/register", async (body, { rejectWithValue }) => {
  try {
    const { data } = await authApi.register(body);
    saveTokens(data.accessToken, data.refreshToken);
    return data.user;
  } catch (error) {
    return rejectWithValue(getErrorMessage(error));
  }
});

export const loginUser = createAsyncThunk<
  User,
  { email: string; password: string },
  { rejectValue: string }
>("auth/login", async (body, { rejectWithValue }) => {
  try {
    const { data } = await authApi.login(body);
    saveTokens(data.accessToken, data.refreshToken);
    return data.user;
  } catch (error) {
    return rejectWithValue(getErrorMessage(error));
  }
});

export const loadUser = createAsyncThunk<User | null>("auth/loadUser", async () => {
  if (!getAccessToken() && !getRefreshToken()) return null;
  try {
    return await authApi.getMe();
  } catch {
    clearTokens();
    return null;
  }
});

export const logoutUser = createAsyncThunk("auth/logout", async () => {
  try {
    await authApi.logout();
  } catch {
  }
  clearTokens();
});

const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {
    forceLogout: (state) => {
      state.user = null;
    },
    clearError: (state) => {
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(registerUser.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(registerUser.fulfilled, (state, action) => {
        state.loading = false;
        state.user = action.payload;
      })
      .addCase(registerUser.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload ?? "Registration failed";
      })
      .addCase(loginUser.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(loginUser.fulfilled, (state, action) => {
        state.loading = false;
        state.user = action.payload;
      })
      .addCase(loginUser.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload ?? "Login failed";
      })
      .addCase(loadUser.fulfilled, (state, action) => {
        state.user = action.payload;
        state.initialized = true;
      })
      .addCase(logoutUser.fulfilled, (state) => {
        state.user = null;
      });
  },
});

export const { forceLogout, clearError } = authSlice.actions;
export default authSlice.reducer;
