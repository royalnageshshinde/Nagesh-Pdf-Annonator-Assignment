import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import api from "../../api/axios.js";

const tokenFromStorage = localStorage.getItem("pdf_token");
const userFromStorage = localStorage.getItem("pdf_user");

// Signup
export const register = createAsyncThunk(
  "auth/register",
  async (payload, { rejectWithValue }) => {
    try {
      const res = await api.post("/auth/register", payload);
      return res.data;
    } catch (err) {
      return rejectWithValue(
        err.response?.data || { message: "Registration failed" }
      );
    }
  }
);

// Login
export const login = createAsyncThunk(
  "auth/login",
  async (payload, { rejectWithValue }) => {
    try {
      const res = await api.post("/auth/login", payload);
      return res.data;
    } catch (err) {
      return rejectWithValue(err.response?.data || { message: "Login failed" });
    }
  }
);

const slice = createSlice({
  name: "auth",
  initialState: {
    token: tokenFromStorage || null,
    user: userFromStorage ? JSON.parse(userFromStorage) : null,
    loading: false,
    error: null,
  },
  reducers: {
    logout(state) {
      state.token = null;
      state.user = null;
      localStorage.removeItem("pdf_token");
      localStorage.removeItem("pdf_user");
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(register.pending, (s) => {
        s.loading = true;
        s.error = null;
      })
      .addCase(register.fulfilled, (s, a) => {
        s.loading = false;
        s.token = a.payload.token;
        s.user = a.payload.user;
        localStorage.setItem("pdf_token", a.payload.token);
        localStorage.setItem("pdf_user", JSON.stringify(a.payload.user));
      })
      .addCase(register.rejected, (s, a) => {
        s.loading = false;
        s.error = a.payload?.message || "Error";
      })
      .addCase(login.pending, (s) => {
        s.loading = true;
        s.error = null;
      })
      .addCase(login.fulfilled, (s, a) => {
        s.loading = false;
        s.token = a.payload.token;
        s.user = a.payload.user;
        localStorage.setItem("pdf_token", a.payload.token);
        localStorage.setItem("pdf_user", JSON.stringify(a.payload.user));
      })
      .addCase(login.rejected, (s, a) => {
        s.loading = false;
        s.error = a.payload?.message || "Error";
      });
  },
});

export const { logout } = slice.actions;
export default slice.reducer;
