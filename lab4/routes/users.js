const express = require("express");
const router = express.Router();
const fs = require("fs/promises");
const path = require("path");
const { query } = require("../helpers/DB");
const bcrypt = require("bcrypt");
const { error } = require("console");
const _ = require("loadsh");
const jwt = require("jsonwebtoken");
const joi = require('joi');

// validation in registration and login by joi 
const registerSchema = joi.object({
  name: joi.string().min(2).max(100).required(),
  email: joi.string().email().required(),
  password: joi.string().min(8).required(),
  age: joi.number().integer().min(13).max(120).required(),
});

const loginSchema = joi.object({
  email: joi.string().email().required(),
  password: joi.string().required(),
});

// registration
router.post("/auth/register", async (req, res) => {
  try {
    const { error } = registerSchema.validate(req.body);
    if (error) return res.status(400).json({ error: error.details[0].message });

    const { name, email, password, age } = req.body;

    const existing = await query("SELECT * FROM users WHERE email=?", [email]);
    if (existing.length > 0) {
      return res.status(409).json({ error: "Email already in use" });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const result = await query(
      "INSERT INTO users (name, email, password_hash, age) VALUES (?, ?, ?, ?)",
      [name, email, hashedPassword, age]
    );

    res.status(201).json({
      id: result.insertId,
      name,
      email,
      age,
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Server error" });
  }
});

// login
router.post("/auth/login", async (req, res) => {
  try {
    const { error } = loginSchema.validate(req.body);
    if (error) return res.status(400).json({ error: error.details[0].message });

    const { email, password } = req.body;
    const users = await query("SELECT * FROM users WHERE email=?", [email]);

    if (users.length === 0) {
      return res.status(401).json({ error: "Invalid email or password" });
    }

    const user = users[0];
    const match = await bcrypt.compare(password, user.password_hash);
    if (!match) return res.status(401).json({ error: "Invalid email or password" });

    const token = jwt.sign({ id: user.id, email: user.email }, "secretkeygfsgd", { expiresIn: "1h" });

    res.json({ token });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Server error" });
  }
});

// profile
router.get("/profile", async (req, res) => {
  try {
    const authHeader = req.headers["authorization"];
    if (!authHeader) return res.status(401).json({ error: "Missing token" });

    const token = authHeader.split(" ")[1];
    if (!token) return res.status(401).json({ error: "Missing token" });

    let decoded;
    try {
      decoded = jwt.verify(token, "secretkeygfsgd");
    } catch (err) {
      return res.status(401).json({ error: "Invalid token" });
    }

    const users = await query("SELECT id, name, email, age, created_at FROM users WHERE id=?", [decoded.id]);
    if (users.length === 0) return res.status(404).json({ error: "User not found" });

    res.json(users[0]);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Server error" });
  }
});

module.exports = router;