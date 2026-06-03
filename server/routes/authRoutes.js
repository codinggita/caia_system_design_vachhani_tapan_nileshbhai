const express = require('express');
const router = express.Router();
const {
  registerUser,
  loginUser,
  logoutUser,
  refreshToken,
  getProfile,
  updateProfile,
  deleteProfile,
  forgotPassword,
  resetPassword,
  verifyEmail,
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

// @route   PATCH /api/v1/auth/profile
// @desc    Update authenticated user's profile fields
// @access  Private
router.patch('/api/v1/auth/profile', protect, updateProfile);

// @route   DELETE /api/v1/auth/profile
// @desc    Delete authenticated user's profile/account
// @access  Private
router.delete('/api/v1/auth/profile', protect, deleteProfile);

// @route   POST /api/v1/auth/forgot-password
// @desc    Generate password reset token code
// @access  Public
router.post('/api/v1/auth/forgot-password', forgotPassword);

// @route   POST /api/v1/auth/reset-password
// @desc    Reset password using reset token code
// @access  Public
router.post('/api/v1/auth/reset-password', resetPassword);

// @route   POST /api/v1/auth/verify-email
// @desc    Generate or validate email verification token code
// @access  Private
router.post('/api/v1/auth/verify-email', protect, verifyEmail);

module.exports = router;
