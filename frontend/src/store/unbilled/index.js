import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import api from '@/common/axios';

// Async thunk for creating a new unbilled record
export const createUnbilled = createAsyncThunk(
  'unbilled/createUnbilled',
  async (formData, { rejectWithValue }) => {
    try {
      const response = await api.post('/createUnbilled', formData);
      return response.data.unbilled;
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || 'Failed to create unbilled record');
    }
  }
);

// Async thunk for fetching a single unbilled record by ID
export const fetchUnbilledById = createAsyncThunk(
  'unbilled/fetchUnbilledById',
  async (orderId, { rejectWithValue }) => {
    try {
      const response = await api.get(`/fetchUnbilledOrderById/${orderId}`);
      return response.data.order;
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || 'Failed to fetch unbilled record');
    }
  }
);

// Async thunk for fetching all unbilled records
export const fetchAllUnbilled = createAsyncThunk(
  'unbilled/fetchAllUnbilled',
  async (_, { rejectWithValue }) => {
    try {
      const response = await api.get('/fetchAllUnbilledOrder');
      return response.data.orders;
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || 'Failed to fetch unbilled records');
    }
  }
);

// Async thunk for deleting an unbilled record
export const deleteUnbilled = createAsyncThunk(
  'unbilled/deleteUnbilled',
  async (orderId, { rejectWithValue }) => {
    try {
      // replaced get with delete- Armaan Siddiqui
      await api.delete(`/unbilled/${orderId}`);
      return orderId;
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || 'Failed to delete unbilled record');
    }
  }
);

// Create the slice
const unbilledSlice = createSlice({
  name: 'unbilled',
  initialState: {
    orders: [],
    selectedOrder: null,
    loading: false,
    error: null,
    totalAmount: 0,
    success: false,
  },
  reducers: {
    clearError: (state) => {
      state.error = null;
    },
    clearSuccess: (state) => {
      state.success = false;
    },
    setSelectedOrder: (state, action) => {
      state.selectedOrder = action.payload;
    },
    clearSelectedOrder: (state) => {
      state.selectedOrder = null;
    },
  },
  extraReducers: (builder) => {
    builder
      // Create Unbilled
      .addCase(createUnbilled.pending, (state) => {
        state.loading = true;
        state.error = null;
        state.success = false;
      })
      .addCase(createUnbilled.fulfilled, (state, action) => {
        state.loading = false;
        state.orders.unshift(action.payload); // Add to start of array
        state.success = true;
        state.totalAmount += action.payload.finalPayment;
      })
      .addCase(createUnbilled.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
        state.success = false;
      })

      // Fetch Single Unbilled
      .addCase(fetchUnbilledById.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchUnbilledById.fulfilled, (state, action) => {
        state.loading = false;
        state.selectedOrder = action.payload;
      })
      .addCase(fetchUnbilledById.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })

      // Fetch All Unbilled
      .addCase(fetchAllUnbilled.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchAllUnbilled.fulfilled, (state, action) => {
        state.loading = false;
        state.orders = action.payload;
        state.totalAmount = action.payload.reduce(
          (total, order) => total + order.finalPayment,
          0
        );
      })
      .addCase(fetchAllUnbilled.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })

      // Delete Unbilled
      .addCase(deleteUnbilled.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(deleteUnbilled.fulfilled, (state, action) => {
        state.loading = false;
        const deletedOrder = state.orders.find(order => order._id === action.payload);
        if (deletedOrder) {
          state.totalAmount -= deletedOrder.finalPayment;
        }
        state.orders = state.orders.filter(order => order._id !== action.payload);
        state.success = true;
      })
      .addCase(deleteUnbilled.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });
  },
});

// Export actions and reducer
export const {
  clearError,
  clearSuccess,
  setSelectedOrder,
  clearSelectedOrder,
} = unbilledSlice.actions;

export default unbilledSlice.reducer;
