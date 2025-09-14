import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import api from "../../api/axios.js";

// Get highlights
export const fetchHighlights = createAsyncThunk(
  "highlights/fetch",
  async (pdfUuid, { rejectWithValue }) => {
    try {
      const res = await api.get(`/highlights/${pdfUuid}`);
      return res.data;
    } catch (err) {
      return rejectWithValue(
        err.response?.data || { message: "Failed to fetch highlights..." }
      );
    }
  }
);

// Create a highlight
export const createHighlight = createAsyncThunk(
  "highlights/create",
  async (payload, { rejectWithValue }) => {
    try {
      const res = await api.post("/highlights", payload);
      return res.data;
    } catch (err) {
      return rejectWithValue(
        err.response?.data || { message: "Failed to save highlight." }
      );
    }
  }
);

// Delete highlight
export const deleteHighlight = createAsyncThunk(
  "highlights/delete",
  async (id, { rejectWithValue }) => {
    try {
      const res = await api.delete(`/highlights/${id}`);
      return { id };
    } catch (err) {
      return rejectWithValue(
        err.response?.data || { message: "Failed to delete highlight." }
      );
    }
  }
);

const slice = createSlice({
  name: "highlights",
  initialState: { list: [], loading: false, error: null },
  reducers: {
    clearHighlights(state) {
      state.list = [];
    },
  },
  extraReducers: (b) => {
    b.addCase(fetchHighlights.pending, (s) => {
      s.loading = true;
      s.error = null;
    })
      .addCase(fetchHighlights.fulfilled, (s, a) => {
        s.loading = false;
        s.list = a.payload;
      })
      .addCase(fetchHighlights.rejected, (s, a) => {
        s.loading = false;
        s.error = a.payload?.message || "Failed to load highlights";
      })
      .addCase(createHighlight.fulfilled, (s, a) => {
        // ✅ Ensure correct shape
        const newHighlight = a.payload.highlight ?? a.payload;
        s.list.push(newHighlight);
      })
      .addCase(deleteHighlight.fulfilled, (s, a) => {
        s.list = s.list.filter((h) => h._id !== a.payload.id);
      });
  },
});

export const { clearHighlights } = slice.actions;
export default slice.reducer;
