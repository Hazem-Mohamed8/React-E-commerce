import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import {
  ADD_PRODUCT_TO_WISHLIST_ROUTE,
  WISHLIST_ROUTE,
} from "../../utils/constants";
import apiClient from "@/lib/api-client.js";

// Fetch wishlist items from the API
export const GetWishList = createAsyncThunk(
  "wishlist/fetchWishlist",
  async () => {
    const token = sessionStorage.getItem("token");

    const response = await apiClient.get(WISHLIST_ROUTE, {
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
      },
    });
    return response.data.products;
  }
);

// Add a product to the wishlist
export const addToWishlist = createAsyncThunk(
  "wishlist/addWishlist",
  async (id) => {
    const token = sessionStorage.getItem("token");

    const response = await apiClient.post(
      ADD_PRODUCT_TO_WISHLIST_ROUTE(id),
      {},
      {
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
      }
    );
    return response.data.product; // Assuming the response returns the added product
  }
);

// Remove a product from the wishlist
export const removeFromWishlist = createAsyncThunk(
  "wishlist/removeWishlist",
  async (id) => {
    const token = sessionStorage.getItem("token");

    const response = await apiClient.delete(ADD_PRODUCT_TO_WISHLIST_ROUTE(id), {
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
      },
    });
    return { id }; // Assuming you only return the ID of the removed product
  }
);

const wishlistSlice = createSlice({
  name: "wishlist",
  initialState: {
    wishlistItems: [],
  },
  reducers: {
    clearWishlist: (state) => {
      state.wishlistItems = [];
    },
  },
  extraReducers: (builder) => {
    builder.addCase(GetWishList.fulfilled, (state, action) => {
      state.wishlistItems = action.payload;
    });
    builder.addCase(addToWishlist.fulfilled, (state, action) => {
      const existingItem = state.wishlistItems.find(
        (item) => item.id === action.payload.id
      );
      if (!existingItem) {
        state.wishlistItems.push(action.payload);
      }
    });
    builder.addCase(removeFromWishlist.fulfilled, (state, action) => {
      state.wishlistItems = state.wishlistItems.filter(
        (item) => item.id !== action.payload.id
      );
    });
  },
});

export const { clearWishlist } = wishlistSlice.actions;
export const wishlistReducer = wishlistSlice.reducer;
