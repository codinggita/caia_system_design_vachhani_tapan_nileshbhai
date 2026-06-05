const express = require('express');
const router = express.Router();

// Import Controller functions
const {
  getProtectedConcepts,
  createProtectedConcept,
  updateProtectedConcept,
  deleteProtectedConcept,
  getAdminProtectedDashboard,
  getLoggerDemo,
  getAuthDemo,
  getRateLimitDemo,
  getCacheDemo,
  getCompressionDemo,
} = require('../controllers/middlewareController');

// Import Middlewares
const { protect, authorize } = require('../middleware/auth');
const logger = require('../middleware/logger');
const rateLimiter = require('../middleware/rateLimiter');
const cacheMiddleware = require('../middleware/cache');
const compression = require('../middleware/compression');

// ============================================================
// PROTECTED CONCEPT ROUTES (Auth required)
// ============================================================
router.get('/api/v1/protected/concepts', protect, getProtectedConcepts);
router.post('/api/v1/protected/concepts', protect, createProtectedConcept);
router.patch('/api/v1/protected/concepts/:id', protect, updateProtectedConcept);
router.delete('/api/v1/protected/concepts/:id', protect, deleteProtectedConcept);

// ============================================================
// ADMIN PROTECTED DASHBOARD ROUTE (Admin & Auth required)
// ============================================================
router.get('/api/v1/admin/protected/dashboard', protect, authorize('admin'), getAdminProtectedDashboard);

// ============================================================
// MIDDLEWARE DEMONSTRATION ROUTES
// ============================================================

// @route   GET /api/v1/middleware/logger
// @desc    Logger middleware demonstration
router.get('/api/v1/middleware/logger', logger, getLoggerDemo);

// @route   GET /api/v1/middleware/auth
// @desc    Auth middleware demonstration
router.get('/api/v1/middleware/auth', protect, getAuthDemo);

// @route   GET /api/v1/middleware/rate-limit
// @desc    Rate limiting middleware demonstration
router.get('/api/v1/middleware/rate-limit', rateLimiter, getRateLimitDemo);

// @route   GET /api/v1/middleware/cache
// @desc    Cache middleware demonstration (10s TTL)
router.get('/api/v1/middleware/cache', cacheMiddleware(10 * 1000), getCacheDemo);

// @route   GET /api/v1/middleware/compression
// @desc    Compression middleware demonstration
router.get('/api/v1/middleware/compression', compression, getCompressionDemo);

module.exports = router;
