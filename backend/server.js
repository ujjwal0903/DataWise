// Import necessary dependencies
const express = require("express");
const fileUpload = require("express-fileupload"); // If you haven't already set it up
const sequelize = require("./database");  // Sequelize instance
const File = require("./models/File");  // Import the File model
const cors = require("cors");  // Import CORS

const app = express();

// Middleware setup
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(fileUpload());

// Enable CORS for all origins (You can customize this as needed)
app.use(cors());  // This will allow all origins by default

// Optionally, restrict CORS to specific domains, e.g., localhost for development
// app.use(cors({
//   origin: 'http://localhost:5173',  // Frontend URL
// }));

// Sync the database (create tables)
sequelize.sync({ force: true })  // Set to false in production to avoid dropping tables
  .then(() => {
    console.log("Tables created!");
  })
  .catch((err) => {
    console.error("Error syncing database:", err);
  });

// File upload route
app.post("/upload", async (req, res) => {
  if (!req.files || !req.files.file) {
    return res.status(400).send("No file uploaded.");
  }

  const file = req.files.file;

  try {
    // Save the file to the "uploads" folder
    const uploadPath = __dirname + "/uploads/" + file.name;
    file.mv(uploadPath, async (err) => {
      if (err) {
        return res.status(500).send(err);
      }

      // Create a record in the File table
      await File.create({
        name: file.name,
        path: uploadPath,
        size: file.size,
        mimeType: file.mimetype,
      });

      res.send("File uploaded successfully!");
    });
  } catch (error) {
    console.error("Error uploading file:", error);
    res.status(500).send("Server error.");
  }
});

// Start the server
const PORT = 5000;
app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});
