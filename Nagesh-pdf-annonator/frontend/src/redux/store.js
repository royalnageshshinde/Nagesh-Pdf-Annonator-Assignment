import { configureStore } from "@reduxjs/toolkit";
import authReducer from "./slices/authSlice.js";
import pdfReducer from "./slices/pdfSlice.js";
import highlightReducer from "./slices/highlightSlice.js";

export default configureStore({
  reducer: {
    auth: authReducer,
    pdfs: pdfReducer,
    highlights: highlightReducer
  },
});
