import express from "express";
import Highlight from "../models/Highlight.js";
import auth from "../middlewares/auth.js";

const router = express.Router();

// Create route
router.post("/", auth, async (req, res) => {
  try {
    const { pdfUuid, page, text, rect, color } = req.body;
    const highlight = new Highlight({
      pdfUuid,
      page,
      text,
      rect,
      color,
      user: req.user.id,
    });
    await highlight.save();
    return res.json(highlight);
  } catch (err) {
    console.error(err);
    return res.status(500).send("Server error...");
  }
});

// pdf highlights for a user
router.get("/:pdfUuid", auth, async (req, res) => {
  try {
    const list = await Highlight.find({
      pdfUuid: req.params.pdfUuid,
      user: req.user.id,
    });
    return res.json(list);
  } catch (err) {
    console.error(err);
    return res.status(500).send("Server error...");
  }
});

// Update route
router.put("/:id", auth, async (req, res) => {
  try {
    const highlight = await Highlight.findById(req.params.id);
    if (!highlight) {
      return res.status(404).json({ message: "Not found..." });
    }
    if (highlight.user.toString() !== req.user.id) {
      return res.status(403).json({ message: "Forbidden!" });
    }
    Object.assign(highlight, req.body);
    await highlight.save();
    return res.json(highlight);
  } catch (err) {
    console.error(err);
    return res.status(500).send("Server error...");
  }
});

// Delete route
router.delete("/:id", auth, async (req, res) => {
  try {
    const highlight = await Highlight.findById(req.params.id);
    if (!highlight) {
      return res.status(404).json({ message: "Not found" });
    }
    if (highlight.user.toString() !== req.user.id) {
      return res.status(403).json({ message: "Forbidden" });
    }
    await highlight.remove();
    return res.json({ message: "Deleted" });
  } catch (err) {
    console.error(err);
    return res.status(500).send("Server error");
  }
});

export default router;
