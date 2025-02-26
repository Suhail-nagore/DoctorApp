import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";

// Async thunk to check authentication
export const checkAuth = createAsyncThunk(
  "auth/checkauth",
  async () => {
    const response = await axios.get("http://localhost:5000/api/checkauth", {
      headers: {
        "Authorization": "Bearer " + localStorage.getItem("token"),
      },
    });
    return response.data; // Returning the response data
  }
);

const authSlice = createSlice({
  name: "auth",
  initialState: {
    isAuthenticated: false,
    user: null, // Add user to the initial state
    loading: false,
    error: null,
  },
  reducers: {
    logout: (state) => {
      state.isAuthenticated = false;
      state.user = null; // Clear the user on logout
      localStorage.removeItem("token");
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(checkAuth.pending, (state) => {
        state.loading = true;
      })
      .addCase(checkAuth.fulfilled, (state, action) => {
        state.loading = false;
        state.isAuthenticated = action.payload.success;
        state.user = action.payload.user || null; // Save the user data
      })
      .addCase(checkAuth.rejected, (state, action) => {
        state.loading = false;
        state.isAuthenticated = false;
        state.user = null; // Clear user data on error
      });
  },
});

export const { logout } = authSlice.actions;

export default authSlice.reducer;
