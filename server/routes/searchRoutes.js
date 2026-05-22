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
    fuzzySearch,
    autocompleteSuggestions,
    getRecentSearches,
    getPopularSearches,
    voiceSearch,
    exactSearch,
    regexSearch,
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

// @route   GET /api/v1/search/fuzzy?q=kafka
// @desc    Fuzzy search
router.get('/api/v1/search/fuzzy', fuzzySearch);

// @route   GET /api/v1/search/autocomplete?q=event
// @desc    Autocomplete suggestions
router.get('/api/v1/search/autocomplete', autocompleteSuggestions);

// @route   GET /api/v1/search/recent
// @desc    Fetch recent searches
router.get('/api/v1/search/recent', getRecentSearches);

// @route   GET /api/v1/search/popular
// @desc    Fetch trending searches
router.get('/api/v1/search/popular', getPopularSearches);

// @route   GET /api/v1/search/voice?q=load balancing
// @desc    Voice optimized search
router.get('/api/v1/search/voice', voiceSearch);

// @route   GET /api/v1/search/exact?q=event sourcing
// @desc    Exact phrase search
router.get('/api/v1/search/exact', exactSearch);

// @route   GET /api/v1/search/regex?pattern=cache
// @desc    Regex based search
router.get('/api/v1/search/regex', regexSearch);

module.exports = router;
