const express = require("express");
const Book = require("../models/Book");
const auth = require("../middleware/auth");

const router = express.Router();

router.post("/", auth, async (req, res) => {
    const { title, author, description } = req.body;
    if (!title || !author || !description) return res.status(400).json("Please fill all fields!");
    
    const book = new Book({ title, author, description });
    await book.save();
    res.status(201).json(book);
  });

router.get("/", async (req, res) => {
  const books = await Book.find();
  res.json(books);
});

router.get("/:id", async (req, res) => {
    const book = await Book.findById(req.params.id);
    if (!book) return res.status(404).json("Book not found");
    res.json(book);
  });

router.patch("/:id", auth, async (req, res) => {
  const book = await Book.findByIdAndUpdate(req.params.id, req.body, { new: true });
  if (!book) return res.status(404).json("Book not found");
  res.json(book);
});

router.delete("/:id", auth, async (req, res) => {
  const book = await Book.findByIdAndDelete(req.params.id);
  if (!book) return res.status(404).json("Book not found");
  res.json("Book deleted successfully");
});

module.exports = router;