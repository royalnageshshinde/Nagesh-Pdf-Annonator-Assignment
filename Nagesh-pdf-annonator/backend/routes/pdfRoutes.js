import express from "express";
import multer from "multer";
import { v4 as uuidv4 } from "uuid";
import path from "path";
import PdfFile from "../models/PdfFile.js";
import auth from "../middlewares/auth.js";
import fs from "fs";

const router = express.Router();

const uploadDir = path.resolve("uploads");
if (!fs.existsSync(uploadDir)) {
  fs.mkdirSync(uploadDir, { recursive: true });
}

const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, uploadDir);
  },
  filename: function (req, file, cb) {
    const unique = `${Date.now()}-${file.originalname}`;
    cb(null, unique);
  },
});
const upload = multer({ storage });


// Uploading PDF
router.post("/upload", auth, upload.single("pdf"), async (req, res) => {
  try {
    const file = req.file;
    if (!file) {
      return res.status(400).json({ message: "No file uploaded!" });
    }
    const pdfUuid = uuidv4();
    const pdf = new PdfFile({
      uuid: pdfUuid,
      originalName: file.originalname,
      filename: file.filename,
      owner: req.user.id,
    });
    await pdf.save();
    return res.json({ uuid: pdfUuid, pdf });
  } catch (err) {
    console.error(err);
    return res.status(500).send("Server error...");
  }
});


// Get user PDFs
router.get("/my", auth, async (req, res) => {
  try {
    const list = await PdfFile.find({ owner: req.user.id }).sort({
      createdAt: -1,
    });
    return res.json(list);
  } catch (err) {
    console.error(err);
    return res.status(500).send("Server error...");
  }
});


// Serve file by uuid (protected)
router.get("/:uuid", auth, async (req, res) => {
  try {
    const pdf = await PdfFile.findOne({ uuid: req.params.uuid });

    if (!pdf) {
      return res.status(404).json({ message: "PDF not found" });
    }
    if (pdf.owner.toString() !== req.user.id) {
      return res.status(403).json({ message: "Forbidden" });
    }

    // ✅ Return only what frontend needs
    return res.json({
      uuid: pdf.uuid,
      originalName: pdf.originalName,
      filename: pdf.filename,   // ✅ crucial for frontend to build URL
      createdAt: pdf.createdAt,
    });
  } catch (err) {
    console.error("Get PDF error:", err);
    return res.status(500).json({ message: "Server error..." });
  }
});


// Delete PDF
router.delete("/:uuid", auth, async (req, res) => {
  try {
    const pdf = await PdfFile.findOne({ uuid: req.params.uuid });
    if (!pdf) return res.status(404).json({ message: "PDF not found..." });
    if (pdf.owner.toString() !== req.user.id) return res.status(403).json({ message: "Forbidden!" });

    const filePath = path.resolve("uploads", pdf.filename);
    try {
      if (fs.existsSync(filePath)) {
        fs.unlinkSync(filePath);
        console.log(`Deleted file: ${filePath}`);
      }
    } catch (fileErr) {
      console.warn("Could not delete file:", fileErr.message);
    }

    await PdfFile.deleteOne({ uuid: pdf.uuid });
    res.json({ message: "Deleted!" });
  } catch (err) {
    console.error(err);
    res.status(500).send("Server error...");
  }
});

export default router;
