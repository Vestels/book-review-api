const express = require("express");
const Review = require("../models/Review");
const Book = require("../models/Book");
const auth = require("../middleware/auth");

const router = express.Router();

router.post("/:bookId/reviews", auth, async (req, res) => {
  const { rating, text } = req.body;
  const { bookId } = req.params;

  const book = await Book.findById(bookId);
  if (!book) return res.status(404).send("Book not found");

  const review = new Review({
    book: bookId,
    user: req.user._id,
    rating,
    text,
  });
  await review.save();

  const reviews = await Review.find({ book: bookId });
  book.averageRating = reviews.reduce((acc, r) => acc + r.rating, 0) / reviews.length;
  await book.save();

  res.status(201).send(review);
});

router.get("/:bookId/reviews", async (req, res) => {
  const reviews = await Review.find({ book: req.params.bookId }).populate("user", "username");
  res.send(reviews);
});

router.patch("/reviews/:id", auth, async (req, res) => {
  const review = await Review.findOne({ _id: req.params.id, user: req.user._id });
  if (!review) return res.status(404).send("Review not found or unauthorized");

  Object.assign(review, req.body);
  await review.save();
  res.send(review);
});

router.delete("/reviews/:id", auth, async (req, res) => {
  const review = await Review.findOneAndDelete({ _id: req.params.id, user: req.user._id });
  if (!review) return res.status(404).send("Review not found or unauthorized");
  res.send("Review deleted successfully");
});

module.exports = router;