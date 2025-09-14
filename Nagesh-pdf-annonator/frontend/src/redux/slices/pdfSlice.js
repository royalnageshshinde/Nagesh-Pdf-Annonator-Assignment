import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import api from "../../api/axios.js";

// Get PDFs
export const fetchMyPdfs = createAsyncThunk(
  "pdfs/fetchMy",
  async (_, { rejectWithValue }) => {
    try {
      const res = await api.get("/pdfs/my");
      return res.data;
    } catch (err) {
      return rejectWithValue(
        err.response?.data || { message: "Failed to fetch PDFs" }
      );
    }
  }
);

// Upload PDFs
export const uploadPdf = createAsyncThunk(
  "pdfs/upload",
  async (formData, { rejectWithValue }) => {
    try {
      const res = await api.post("/pdfs/upload", formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });
      return res.data.pdf;
    } catch (err) {
      return rejectWithValue(
        err.response?.data || { message: "Upload failed" }
      );
    }
  }
);

// Delete a PDF
export const deletePdf = createAsyncThunk(
  "pdfs/delete",
  async (uuid, { rejectWithValue }) => {
    try {
      const res = await api.delete(`/pdfs/${uuid}`);
      return { uuid, msg: res.data.message };
    } catch (err) {
      return rejectWithValue(
        err.response?.data || { message: "Deletion failed" }
      );
    }
  }
);

const slice = createSlice({
  name: "pdfs",
  initialState: { list: [], loading: false, error: null },
  reducers: {},
  extraReducers: (b) => {
    b.addCase(fetchMyPdfs.pending, (s) => {
      s.loading = true;
      s.error = null;
    })
      .addCase(fetchMyPdfs.fulfilled, (s, a) => {
        s.loading = false;
        s.list = a.payload;
      })
      .addCase(fetchMyPdfs.rejected, (s, a) => {
        s.loading = false;
        s.error = a.payload?.message;
      })

      .addCase(uploadPdf.pending, (s) => {
        s.loading = true;
        s.error = null;
      })
      .addCase(uploadPdf.fulfilled, (s, a) => {
        s.loading = false;
        s.list.unshift(a.payload);
      })
      .addCase(uploadPdf.rejected, (s, a) => {
        s.loading = false;
        s.error = a.payload?.message;
      })

      .addCase(deletePdf.fulfilled, (s, a) => {
        s.list = s.list.filter((p) => p.uuid !== a.payload.uuid);
      });
  },
});

export default slice.reducer;
