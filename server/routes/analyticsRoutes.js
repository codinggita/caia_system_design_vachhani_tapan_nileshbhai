const express = require('express');
const router = express.Router();
const {
    getTotalConcepts,
    getCategoryDistribution,
    getDifficultyStats,
    getTopPatterns,
    getTopLanguages
} = require('../controllers/analyticsController');

// ============================================================
// ANALYTICS ROUTES
// ============================================================

// @route   GET /api/v1/analytics/total-concepts
// @desc    Total concepts count
router.get('/api/v1/analytics/total-concepts', getTotalConcepts);

// @route   GET /api/v1/analytics/category-distribution
// @desc    Category distribution
router.get('/api/v1/analytics/category-distribution', getCategoryDistribution);

// @route   GET /api/v1/analytics/difficulty-stats
// @desc    Difficulty analytics
router.get('/api/v1/analytics/difficulty-stats', getDifficultyStats);

// @route   GET /api/v1/analytics/patterns/top
// @desc    Top patterns
router.get('/api/v1/analytics/patterns/top', getTopPatterns);

// @route   GET /api/v1/analytics/languages/top
// @desc    Top languages
router.get('/api/v1/analytics/languages/top', getTopLanguages);

module.exports = router;
