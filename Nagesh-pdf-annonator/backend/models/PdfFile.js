import mongoose from "mongoose";

const PdfFileSchema = new mongoose.Schema(
  {
    uuid: { type: String, required: true, unique: true },
    originalName: { type: String, required: true }, 
    filename: { type: String, required: true },     
    owner: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
  },
  { timestamps: true }
);

export default mongoose.model("PdfFile", PdfFileSchema);