const express = require("express");
const multer = require("multer");
const File = require("../models/File");
const path = require("path");

const router = express.Router();

// Configure multer
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, "uploads/"); // Save files in 'uploads/' folder
  },
  filename: (req, file, cb) => {
    cb(null, Date.now() + path.extname(file.originalname));
  },
});

const upload = multer({ storage });

// Upload file and save metadata
router.post("/upload", upload.single("file"), async (req, res) => {
  try {
    const newFile = await File.create({
      name: req.file.originalname,
      path: req.file.path,
    });
    res.status(201).json({ message: "File uploaded successfully", file: newFile });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Failed to upload file" });
  }
});

module.exports = router;
