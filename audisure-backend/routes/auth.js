import express from 'express';
import db from '../db.js';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import dotenv from 'dotenv';
dotenv.config();

const router = express.Router();

// Helper to normalize email
function normalizeEmail(email) {
  return email.trim().toLowerCase();
}

// REGISTER
router.post('/register', async (req, res) => {
  const { firstName, lastName, email, password } = req.body;
  const normalizedEmail = normalizeEmail(email);

  try {
    // Check if email exists
    const [existing] = await db.query(
      'SELECT * FROM users WHERE LOWER(email) = ?',
      [normalizedEmail]
    );
    console.log('Checking email:', normalizedEmail);
    console.log('Existing result:', existing);

    if (existing.length > 0) {
      return res.json({ success: false, message: 'Email already exists' });
    }

    // Hash password
    const hashedPassword = await bcrypt.hash(password, 10);

    // Insert user with default role 'user'
    const [result] = await db.query(
      'INSERT INTO users (first_name, last_name, email, password, role) VALUES (?, ?, ?, ?, ?)',
      [firstName, lastName, normalizedEmail, hashedPassword, 'user']
    );

    console.log("✅ User inserted with ID:", result.insertId);

    res.json({ success: true, message: 'User registered successfully', userId: result.insertId });
  } catch (err) {
    console.error('Register error:', err.sqlMessage || err);
    res.status(500).json({ success: false, message: err.sqlMessage || 'Server error' });
  }
});

// LOGIN
router.post('/login', async (req, res) => {
  const { email, password } = req.body;
  const normalizedEmail = normalizeEmail(email);

  try {
    const [rows] = await db.query(
      'SELECT * FROM users WHERE LOWER(email) = ?',
      [normalizedEmail]
    );
    console.log('Login attempt for:', normalizedEmail);
    console.log('User rows found:', rows);

    if (!rows || rows.length === 0) {
      return res.json({ success: false, message: 'Invalid credentials' });
    }

    const user = rows[0];
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) return res.json({ success: false, message: 'Invalid credentials' });

    // Create JWT
    const token = jwt.sign(
      { id: user.id, role: user.role },
      process.env.JWT_SECRET,
      { expiresIn: '1d' }
    );

    res.json({
      success: true,
      token,
      user: {
        id: user.id,
        email: user.email,
        role: user.role,
        firstName: user.first_name,
        lastName: user.last_name,
      },
    });
  } catch (err) {
    console.error('Login error:', err.sqlMessage || err);
    res.status(500).json({ success: false, message: err.sqlMessage || 'Server error' });
  }
});

export default router;
