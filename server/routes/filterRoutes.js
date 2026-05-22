const express = require('express');
const router = express.Router();
const {
    filterByCategory,
    filterByDifficulty,
    filterByPattern,
    filterByLanguage,
    filterByDate,
    filterByTags,
    fetchBookmarks,
    fetchTrending,
    fetchPopular,
    fetchUnexplored,
    fetchExpertOnly,
    fetchFrontend,
    fetchBackend,
    fetchDevops,
    fetchCloud
} = require('../controllers/filterController');

// @route   GET /api/v1/filter/category?name=Microservices
router.get('/api/v1/filter/category', filterByCategory);

// @route   GET /api/v1/filter/difficulty?level=beginner
router.get('/api/v1/filter/difficulty', filterByDifficulty);

// @route   GET /api/v1/filter/pattern?name=Saga
router.get('/api/v1/filter/pattern', filterByPattern);

// @route   GET /api/v1/filter/language?name=Go
router.get('/api/v1/filter/language', filterByLanguage);

// @route   GET /api/v1/filter/date?after=2025-01-01
router.get('/api/v1/filter/date', filterByDate);

// @route   GET /api/v1/filter/tags?list=redis,kafka
router.get('/api/v1/filter/tags', filterByTags);

// @route   GET /api/v1/filter/bookmarks
router.get('/api/v1/filter/bookmarks', fetchBookmarks);

// @route   GET /api/v1/filter/trending
router.get('/api/v1/filter/trending', fetchTrending);

// @route   GET /api/v1/filter/popular
router.get('/api/v1/filter/popular', fetchPopular);

// @route   GET /api/v1/filter/unexplored
router.get('/api/v1/filter/unexplored', fetchUnexplored);

// @route   GET /api/v1/filter/expert-only
router.get('/api/v1/filter/expert-only', fetchExpertOnly);

// @route   GET /api/v1/filter/frontend
router.get('/api/v1/filter/frontend', fetchFrontend);

// @route   GET /api/v1/filter/backend
router.get('/api/v1/filter/backend', fetchBackend);

// @route   GET /api/v1/filter/devops
router.get('/api/v1/filter/devops', fetchDevops);

// @route   GET /api/v1/filter/cloud
router.get('/api/v1/filter/cloud', fetchCloud);

module.exports = router;
