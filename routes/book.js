const express = require("express");
const Book = require("../models/Book");
const auth = require("../middleware/auth");

const router = express.Router();

// Creates a book with the requested properties.
/**
 * @swagger
 * /books:
 *   post:
 *     summary: Creates a new book
 *     tags: [Books]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               title:
 *                 type: string
 *                 example: "The Great Gatsby"
 *               author:
 *                 type: string
 *                 example: "F. Scott Fitzgerald"
 *               description:
 *                 type: string
 *                 example: "A novel set in the Jazz Age."
 *     responses:
 *       201:
 *         description: Book created successfully
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Book'
 *       400:
 *         description: Please fill all fields
 */
router.post("/", auth, async (req, res) => {
    const { title, author, description } = req.body;
    if (!title || !author || !description) return res.status(400).json("Please fill all fields!");
    
    const book = new Book({ title, author, description });
    await book.save();
    res.status(201).json(book);
  });

// Returns a list of all books.
/**
 * @swagger
 * /books:
 *   get:
 *     summary: Retrieves a list of all books
 *     tags: [Books]
 *     responses:
 *       200:
 *         description: A list of books
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/Book'
 */
router.get("/", async (req, res) => {
  const books = await Book.find();
  res.json(books);
});

// Returns one book by an ID.
/**
 * @swagger
 * /books/{id}:
 *   get:
 *     summary: Retrieves a book by ID
 *     tags: [Books]
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: string
 *         required: true
 *         description: The book ID
 *     responses:
 *       200:
 *         description: Book found
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Book'
 *       404:
 *         description: Book not found
 */
router.get("/:id", async (req, res) => {
    const book = await Book.findById(req.params.id);
    if (!book) return res.status(404).json("Book not found");
    res.json(book);
  });

// Updates a book property/ies by an ID.
/**
 * @swagger
 * /books/{id}:
 *   patch:
 *     summary: Updates a book by ID
 *     tags: [Books]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: string
 *         required: true
 *         description: The book ID
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               title:
 *                 type: string
 *                 example: "Updated Book Title"
 *               author:
 *                 type: string
 *                 example: "Updated Author"
 *               description:
 *                 type: string
 *                 example: "Updated description of the book."
 *     responses:
 *       200:
 *         description: Book updated successfully
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Book'
 *       404:
 *         description: Book not found
 */
router.patch("/:id", auth, async (req, res) => {
  const book = await Book.findByIdAndUpdate(req.params.id, req.body, { new: true });
  if (!book) return res.status(404).json("Book not found");
  res.json(book);
});

// Deletes one book by an ID.
/**
 * @swagger
 * /books/{id}:
 *   delete:
 *     summary: Deletes a book by ID
 *     tags: [Books]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: string
 *         required: true
 *         description: The book ID
 *     responses:
 *       200:
 *         description: Book deleted successfully
 *       404:
 *         description: Book not found
 */
router.delete("/:id", auth, async (req, res) => {
  const book = await Book.findByIdAndDelete(req.params.id);
  if (!book) return res.status(404).json("Book not found");
  res.json("Book deleted successfully");
});

module.exports = router;