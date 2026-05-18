const express = require('express');
const router = express.Router();
const {
    globalSearch,
    searchByTitle,
    searchByContent,
    searchByTags,
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

module.exports = router;
