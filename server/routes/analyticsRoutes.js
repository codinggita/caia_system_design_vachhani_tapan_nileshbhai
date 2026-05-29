const express = require('express');
const router = express.Router();
const {
    getTotalConcepts,
    getCategoryDistribution,
    getDifficultyStats,
    getTopPatterns,
    getTopLanguages,
    getMostViewed,
    getMostBookmarked,
    getTrending,
    getMonthlyGrowth,
    getTopSearches
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

// @route   GET /api/v1/analytics/views/top
// @desc    Most viewed concepts
router.get('/api/v1/analytics/views/top', getMostViewed);

// @route   GET /api/v1/analytics/bookmarks/top
// @desc    Most bookmarked concepts
router.get('/api/v1/analytics/bookmarks/top', getMostBookmarked);

// @route   GET /api/v1/analytics/trending
// @desc    Trending analytics
router.get('/api/v1/analytics/trending', getTrending);

// @route   GET /api/v1/analytics/growth
// @desc    Monthly growth stats
router.get('/api/v1/analytics/growth', getMonthlyGrowth);

// @route   GET /api/v1/analytics/searches/top
// @desc    Most searched keywords
router.get('/api/v1/analytics/searches/top', getTopSearches);

module.exports = router;
