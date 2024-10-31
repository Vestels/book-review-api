const express = require("express");
const User = require("../models/User");
const jwt = require("jsonwebtoken");
const auth = require("../middleware/auth");

const router = express.Router();


// Register a user with username and password properties.
/**
 * @swagger
 * /users/register:
 *   post:
 *     summary: Registers a new user
 *     tags: [Users]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               username:
 *                 type: string
 *                 example: "teszt_user48"
 *               password:
 *                 type: string
 *                 example: "mypassword537"
 *     responses:
 *       201:
 *         description: User registered successfully
 *       400:
 *         description: Error registering user
 */
router.post("/register", async (req, res) => {
  const { username, password } = req.body;
  try {
    const user = new User({ username, password });
    await user.save();
    res.status(201).send("User registered successfully");
   
  } catch (error) {
    res.status(400).send("Error registering user");
  }
});

// Logs the user in and returns a JWT token.
/**
 * @swagger
 * /users/login:
 *   post:
 *     summary: Logs in a user
 *     tags: [Users]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               username:
 *                 type: string
 *                 example: "teszt_user48"
 *               password:
 *                 type: string
 *                 example: "mypassword537"
 *     responses:
 *       200:
 *         description: Successful login, returns a JWT token
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 token:
 *                   type: string
 *                   example: "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
 *       400:
 *         description: Invalid username or password
 */
router.post("/login", async (req, res) => {
  const { username, password } = req.body;
  const user = await User.findOne({ username });
  if (!user || !(await user.comparePassword(password)))
    return res.status(400).send("Invalid username or password");

  const token = jwt.sign({ _id: user._id }, process.env.JWT_SECRET);
  res.send({ token });
});

// Return user's authorized informations.
/**
 * @swagger
 * /users/me:
 *   get:
 *     summary: Retrieves authenticated user's information
 *     tags: [Users]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: User information retrieved successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 _id:
 *                   type: string
 *                   example: "603e5b3f4f1a2e001f6e8b88"
 *                 username:
 *                   type: string
 *                   example: "teszt_user48"
 *       401:
 *         description: Unauthorized, invalid or missing token
 */
router.get("/me", auth, async (req, res) => {
  const user = await User.findById(req.user._id);
  res.send(user);
});

module.exports = router;