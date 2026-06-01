const express = require('express');
const router = express.Router();
const {
    getTotalConcepts,
    getCategoryDistribution,
    getDifficultyStats,
    getTopPatterns,
    getTopLanguages,
    getTopViewedConcepts,
    getTopBookmarkedConcepts,
    getTrendingAnalytics,
    getMonthlyGrowth,
    getTopSearchedKeywords,
    getFailedSearches,
    getUserEngagement,
    getApiPerformance,
    getDatabasePerformance,
    getCacheHitRate
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
router.get('/api/v1/analytics/views/top', getTopViewedConcepts);

// @route   GET /api/v1/analytics/bookmarks/top
// @desc    Most bookmarked concepts
router.get('/api/v1/analytics/bookmarks/top', getTopBookmarkedConcepts);

// @route   GET /api/v1/analytics/trending
// @desc    Trending analytics
router.get('/api/v1/analytics/trending', getTrendingAnalytics);

// @route   GET /api/v1/analytics/growth
// @desc    Monthly growth stats
router.get('/api/v1/analytics/growth', getMonthlyGrowth);

// @route   GET /api/v1/analytics/searches/top
// @desc    Most searched keywords
router.get('/api/v1/analytics/searches/top', getTopSearchedKeywords);

// @route   GET /api/v1/analytics/searches/failed
// @desc    Failed searches
router.get('/api/v1/analytics/searches/failed', getFailedSearches);

// @route   GET /api/v1/analytics/engagement
// @desc    User engagement analytics
router.get('/api/v1/analytics/engagement', getUserEngagement);

// @route   GET /api/v1/analytics/api-performance
// @desc    API performance metrics
router.get('/api/v1/analytics/api-performance', getApiPerformance);

// @route   GET /api/v1/analytics/database-performance
// @desc    Database performance
router.get('/api/v1/analytics/database-performance', getDatabasePerformance);

// @route   GET /api/v1/analytics/cache-hit-rate
// @desc    Cache analytics
router.get('/api/v1/analytics/cache-hit-rate', getCacheHitRate);

module.exports = router;
