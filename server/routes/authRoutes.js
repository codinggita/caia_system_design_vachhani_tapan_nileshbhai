const express = require('express');
const router = express.Router();
const {
  registerUser,
  loginUser,
  logoutUser,
  refreshToken,
  getProfile,
} = require('../controllers/authController');
const { protect } = require('../middleware/auth');

// ============================================================
// AUTHENTICATION ROUTES
// ============================================================

// @route   POST /api/v1/auth/register
// @desc    Register a new user account
// @access  Public
router.post('/api/v1/auth/register', registerUser);

// @route   POST /api/v1/auth/login
// @desc    Login user and return JWT tokens
// @access  Public
router.post('/api/v1/auth/login', loginUser);

// @route   POST /api/v1/auth/logout
// @desc    Logout user, clear tokens and cookies
// @access  Private
router.post('/api/v1/auth/logout', protect, logoutUser);

// @route   POST /api/v1/auth/refresh-token
// @desc    Refresh JWT access token using refresh token
// @access  Public
router.post('/api/v1/auth/refresh-token', refreshToken);

// @route   GET /api/v1/auth/profile
// @desc    Fetch authenticated user's profile
// @access  Private
router.get('/api/v1/auth/profile', protect, getProfile);

module.exports = router;
