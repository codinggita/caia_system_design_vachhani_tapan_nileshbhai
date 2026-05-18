const express = require('express');
const router = express.Router();
const {
    globalSearch,
    searchByTitle,
    searchByContent,
    searchByTags,
    searchByPatterns,
    searchByLanguage,
    searchByCategory,
    searchByDifficulty,
} = require('../controllers/searchController');

// ============================================================
// SEARCH ROUTES
// ============================================================

// @route   GET /api/v1/search?q=scaling
// @desc    Global keyword search across all fields
router.get('/api/v1/search', globalSearch);

// @route   GET /api/v1/search/title?q=redis
// @desc    Search inside concept titles only
router.get('/api/v1/search/title', searchByTitle);

// @route   GET /api/v1/search/content?q=database
// @desc    Search inside concept responses/content
router.get('/api/v1/search/content', searchByContent);

// @route   GET /api/v1/search/tags?q=caching
// @desc    Search using tags
router.get('/api/v1/search/tags', searchByTags);

// @route   GET /api/v1/search/patterns?q=CQRS
// @desc    Search by design patterns
router.get('/api/v1/search/patterns', searchByPatterns);

// @route   GET /api/v1/search/language?q=python
// @desc    Search by programming language
router.get('/api/v1/search/language', searchByLanguage);

// @route   GET /api/v1/search/category?q=distributed
// @desc    Search by category
router.get('/api/v1/search/category', searchByCategory);

// @route   GET /api/v1/search/difficulty?q=advanced
// @desc    Search by difficulty level
router.get('/api/v1/search/difficulty', searchByDifficulty);

module.exports = router;
