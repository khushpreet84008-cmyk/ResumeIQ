const express = require("express");
const { upload } = require("../config/upload");
const { extractText } = require("../services/fileTextExtractor");
const { analyzeResume } = require("../services/resumeAnalyzer");

const router = express.Router();
router.post("/", upload.single("resume"), async (req, res) => {
  try {
    if (!req.file) return res.status(400).json({ error: "Please choose a resume file to upload." });
    const text = await extractText(req.file);
    if (!text || text.trim().length < 80) {
      return res.status(422).json({
        error: "We could not read enough text from this file. If it is a scanned image, please upload a text-based PDF or DOCX.",
      });
    }
    const result = analyzeResume(text, {
      location: (req.body.location || "India").trim(),
      experienceLevel: req.body.level || "auto",
    });
    return res.json(result);
  } catch (err) {
    console.error(err);
    return res.status(500).json({ error: err.message || "Something went wrong while analysing the resume." });
  }
});
module.exports = router;
