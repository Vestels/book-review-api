const express = require("express");
const User = require("../models/User");
const jwt = require("jsonwebtoken");
const auth = require("../middleware/auth");

const router = express.Router();

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

router.post("/login", async (req, res) => {
  const { username, password } = req.body;
  const user = await User.findOne({ username });
  if (!user || !(await user.comparePassword(password)))
    return res.status(400).send("Invalid username or password");

  const token = jwt.sign({ _id: user._id }, process.env.JWT_SECRET);
  res.send({ token });
});

router.get("/me", auth, async (req, res) => {
  const user = await User.findById(req.user._id);
  res.send(user);
});

module.exports = router;