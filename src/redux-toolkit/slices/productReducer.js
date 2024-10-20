import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";

// Async thunk to fetch products
export const fetchProducts = createAsyncThunk(
  "productsSlice/fetchProducts",
  async (page, { rejectWithValue }) => {
    try {
      const res = await fetch(
        `http://localhost:3000/api/v1/products?page=${page}`
      );
      if (!res.ok) {
        throw new Error("Failed to fetch products");
      }
      const data = await res.json();
      return data.products; // Assuming products is an array
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);

// Redux slice
export const productsSlice = createSlice({
  name: "productsSlice",
  initialState: {
    products: [],
    page: 1,
    loading: false,
    error: null,
  },
  reducers: {
    addProduct: (state, action) => {
      state.products.push(action.payload);
    },
    incPage: (state) => {
      if (state.page <= 3) {
        state.products = [];
        state.page += 1;
      }
    },
    decPage: (state) => {
      if (state.page > 1) {
        state.products = [];
        state.page -= 1;
      }
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchProducts.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchProducts.fulfilled, (state, action) => {
        state.products = [];
        state.products = [...state.products, ...action.payload];
        console.log(state.products);

        state.loading = false;
      })
      .addCase(fetchProducts.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });
  },
});

// Export actions and reducer
export const { addProduct, incPage, decPage } = productsSlice.actions;
export const productsReducer = productsSlice.reducer;
