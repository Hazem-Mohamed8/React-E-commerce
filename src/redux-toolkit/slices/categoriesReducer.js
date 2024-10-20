import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";

export const getCategories = createAsyncThunk(
  "categoriesSlice/getCategories",
  async () => {
    const res = await fetch("http://localhost:3000/api/v1/sub-categories");
    const data = await res.json();
    return data;
  }
);
export const categoriesSlice = createSlice({
  name: "categoriesSlice",
  initialState: [],
  reducers: {},
  extraReducers: (build) => {
    build.addCase(getCategories.fulfilled, (state, action) => {
      console.log("reduser", action.payload);

      return action.payload;
    });
  },
});

export const categoriesReducer = categoriesSlice.reducer;
