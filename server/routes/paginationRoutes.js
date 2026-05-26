const express = require('express');
const router = express.Router();
const {
  getPaginatedConcepts,
  getScrollConcepts,
  getInfiniteConcepts,
  getPaginatedLatestConcepts,
  getPaginatedTrendingConcepts
} = require('../controllers/paginationController');

// ============================================================
// PAGINATION ROUTES
// ============================================================

// @route   GET /api/v1/concepts
// @desc    Standard pagination
router.get('/api/v1/concepts', getPaginatedConcepts);

// @route   GET /api/v1/concepts/scroll
// @desc    Cursor pagination
router.get('/api/v1/concepts/scroll', getScrollConcepts);

// @route   GET /api/v1/concepts/infinite
// @desc    Infinite scrolling
router.get('/api/v1/concepts/infinite', getInfiniteConcepts);

// @route   GET /api/v1/concepts/latest
// @desc    Paginated latest concepts
router.get('/api/v1/concepts/latest', getPaginatedLatestConcepts);

// @route   GET /api/v1/concepts/trending
// @desc    Paginated trending concepts
router.get('/api/v1/concepts/trending', getPaginatedTrendingConcepts);

module.exports = router;
