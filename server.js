require("dotenv").config();
const express = require("express");
const mongoose = require("mongoose");

const userRoutes = require("./routes/user");
const bookRoutes = require("./routes/book");
const reviewRoutes = require("./routes/review");

const app = express();
app.use(express.json());

// MongoDB kapcsolódás
mongoose.connect(process.env.MONGODB_URI, {
}).then(() => console.log("MongoDB connected"))
  .catch((error) => console.log("MongoDB connection error:", error));

// API útvonalak
app.use("/users", userRoutes);
app.use("/books", bookRoutes);
app.use("/books", reviewRoutes);

// Szerver indítása
const PORT = process.env.PORT || 4000;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});