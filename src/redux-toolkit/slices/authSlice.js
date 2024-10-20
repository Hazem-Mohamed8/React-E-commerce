import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import apiClient from "@/lib/api-client.js";
import { USER_BY_ID_ROUTE } from "../../utils/constants";

// Async thunk to update user data
export const updateUser = createAsyncThunk(
  "auth/updateUser",
  async (id, { rejectWithValue }) => {
    try {
      const response = await apiClient.patch(USER_BY_ID_ROUTE(id));
      return response.data.data.user;
    } catch (error) {
      return rejectWithValue(error.response?.data || "Failed to update user");
    }
  }
);

export const AuthSlice = createSlice({
  name: "auth",
  initialState: {
    userInfo: null,
    loading: false,
    error: null,
  },
  reducers: {
    setUserInfo: (state, action) => {
      state.userInfo = action.payload;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(updateUser.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(updateUser.fulfilled, (state, action) => {
        state.loading = false;
        state.userInfo = action.payload;
      })
      .addCase(updateUser.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });
  },
});

export const { setUserInfo } = AuthSlice.actions;

export const authReducer = AuthSlice.reducer;
