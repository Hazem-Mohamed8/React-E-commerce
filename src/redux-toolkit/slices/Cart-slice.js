import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import { ADD_PRODUCT_TO_CART_ROUTE, CART_ROUTE } from "../../utils/constants";
import apiClient from "@/lib/api-client.js";

// Fetch cart items from the API
export const GetCart = createAsyncThunk(
  "cart/fetchCart",
  async (_, { rejectWithValue }) => {
    const token = sessionStorage.getItem("token");

    if (!token) {
      return rejectWithValue("No token found");
    }

    try {
      const response = await apiClient.get(CART_ROUTE, {
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
      });
      return response.data.products;
    } catch (error) {
      return rejectWithValue(error.response?.data || "Failed to fetch cart");
    }
  }
);

// Add a product to the cart
export const addToCart = createAsyncThunk(
  "cart/addCart",
  async (id, { rejectWithValue }) => {
    const token = sessionStorage.getItem("token");

    if (!token) {
      return rejectWithValue("No token found");
    }

    try {
      const response = await apiClient.post(
        ADD_PRODUCT_TO_CART_ROUTE(id),
        {},
        {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        }
      );

      if (!response.data || !response.data.product) {
        throw new Error("Invalid product data");
      }

      return response.data.product; // Assuming the response returns the added product
    } catch (error) {
      return rejectWithValue(error.response?.data || "Failed to add product");
    }
  }
);

// Remove a product from the cart
export const removeFromCart = createAsyncThunk(
  "cart/removeCart",
  async (id, { rejectWithValue }) => {
    const token = sessionStorage.getItem("token");

    if (!token) {
      return rejectWithValue("No token found");
    }

    try {
      await apiClient.delete(ADD_PRODUCT_TO_CART_ROUTE(id), {
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
      });
      return { id };
    } catch (error) {
      return rejectWithValue(
        error.response?.data || "Failed to remove product"
      );
    }
  }
);

const cartSlice = createSlice({
  name: "cart",
  initialState: {
    cartItems: [],
    loading: false,
    error: null,
  },
  reducers: {
    clearCart: (state) => {
      state.cartItems = [];
    },
  },
  extraReducers: (builder) => {
    // Get Cart
    builder.addCase(GetCart.pending, (state) => {
      state.loading = true;
      state.error = null;
    });
    builder.addCase(GetCart.fulfilled, (state, action) => {
      state.loading = false;
      state.cartItems = action.payload;
    });
    builder.addCase(GetCart.rejected, (state, action) => {
      state.loading = false;
      state.error = action.payload || "Failed to load cart";
    });

    // Add to Cart
    builder.addCase(addToCart.pending, (state) => {
      state.loading = true;
      state.error = null;
    });
    builder.addCase(addToCart.fulfilled, (state, action) => {
      if (!action.payload || !action.payload.id) {
        console.error("Invalid payload:", action.payload); // Log invalid payloads
        state.loading = false;
        return;
      }

      const existingItem = state.cartItems.find(
        (item) => item.id === action.payload.id
      );
      if (!existingItem) {
        state.cartItems.push(action.payload);
      }
      state.loading = false;
    });
    builder.addCase(addToCart.rejected, (state, action) => {
      state.loading = false;
      state.error = action.payload || "Failed to add product to cart";
    });

    // Remove from Cart
    builder.addCase(removeFromCart.pending, (state) => {
      state.loading = true;
      state.error = null;
    });
    builder.addCase(removeFromCart.fulfilled, (state, action) => {
      state.loading = false;
      state.cartItems = state.cartItems.filter(
        (item) => item.id !== action.payload.id
      );
    });
    builder.addCase(removeFromCart.rejected, (state, action) => {
      state.loading = false;
      state.error = action.payload || "Failed to remove product from cart";
    });
  },
});

export const { clearCart } = cartSlice.actions;
export const cartReducer = cartSlice.reducer;
