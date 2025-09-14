import mongoose from "mongoose";

const HighlightSchema = new mongoose.Schema({
  pdfUuid: { type: String, required: true },
  user: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
  page: Number,
  text: String,
  rect: Object,
  color: { type: String, default: "yellow" },
  createdAt: { type: Date, default: Date.now },
});

export default mongoose.model("Highlight", HighlightSchema);
