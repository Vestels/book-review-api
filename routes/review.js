const express = require("express");
const Review = require("../models/Review");
const Book = require("../models/Book");
const auth = require("../middleware/auth");

const router = express.Router();

// Creates a review for a book.
/**
 * @swagger
 * /books/{bookId}/reviews:
 *   post:
 *     summary: Creates a new review for a book
 *     tags: [Reviews]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: bookId
 *         schema:
 *           type: string
 *         required: true
 *         description: The ID of the book
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               rating:
 *                 type: integer
 *                 minimum: 1
 *                 maximum: 5
 *                 example: 4
 *               text:
 *                 type: string
 *                 example: "Great book!"
 *     responses:
 *       201:
 *         description: Review created successfully
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Review'
 *       404:
 *         description: Book not found
 */
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

  // Updates the avarage of the book's rating.
  const reviews = await Review.find({ book: bookId });
  book.averageRating = reviews.reduce((acc, r) => acc + r.rating, 0) / reviews.length;
  await book.save();

  res.status(201).send(review);
});

// Retrieves all ratings of a book.
/**
 * @swagger
 * /books/{bookId}/reviews:
 *   get:
 *     summary: Retrieves all reviews for a specific book
 *     tags: [Reviews]
 *     parameters:
 *       - in: path
 *         name: bookId
 *         schema:
 *           type: string
 *         required: true
 *         description: The ID of the book
 *     responses:
 *       200:
 *         description: List of reviews for the book
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/Review'
 *       404:
 *         description: Book not found
 */
router.get("/:bookId/reviews", async (req, res) => {
  const reviews = await Review.find({ book: req.params.bookId }).populate("user", "username");
  res.send(reviews);
});

// Updates review by an ID.
/**
 * @swagger
 * /books/reviews/{id}:
 *   patch:
 *     summary: Updates a review
 *     tags: [Reviews]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: string
 *         required: true
 *         description: The ID of the review
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               rating:
 *                 type: integer
 *                 minimum: 1
 *                 maximum: 5
 *                 example: 5
 *               text:
 *                 type: string
 *                 example: "Updated review text."
 *     responses:
 *       200:
 *         description: Review updated successfully
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Review'
 *       404:
 *         description: Review not found or unauthorized
 */
router.patch("/reviews/:id", auth, async (req, res) => {
  const review = await Review.findOne({ _id: req.params.id, user: req.user._id });
  if (!review) return res.status(404).send("Review not found or unauthorized");

  Object.assign(review, req.body);
  await review.save();
  res.send(review);
});

// Deletes a review by an ID.
/**
 * @swagger
 * /books/reviews/{id}:
 *   delete:
 *     summary: Deletes a review
 *     tags: [Reviews]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: string
 *         required: true
 *         description: The ID of the review
 *     responses:
 *       200:
 *         description: Review deleted successfully
 *       404:
 *         description: Review not found or unauthorized
 */
router.delete("/reviews/:id", auth, async (req, res) => {
  const review = await Review.findOneAndDelete({ _id: req.params.id, user: req.user._id });
  if (!review) return res.status(404).send("Review not found or unauthorized");
  res.send("Review deleted successfully");
});

module.exports = router;