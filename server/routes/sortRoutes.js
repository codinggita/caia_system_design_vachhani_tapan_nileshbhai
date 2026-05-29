const express = require('express');
const router = express.Router();
const {
    sortByTitle,
    sortNewestFirst,
    sortOldestFirst,
    sortByViews,
    sortByBookmarks,
    sortByDifficulty,
    sortByCategory,
    sortByLanguage,
    sortByPopularity,
    sortByUpdatedAt
} = require('../controllers/sortController');

// ============================================================
// SORT ROUTES
// ============================================================

// @route   GET /api/v1/concepts
// @desc    Fetch concepts with sorting if ?sort= is present
router.get('/api/v1/concepts', (req, res, next) => {
    // Strip any accidental quotes (e.g. from Postman)
    const sortParam = (req.query.sort || '').replace(/^["']|["']$/g, '').trim();

    if (!sortParam) {
        return next();
    }

    switch (sortParam) {
        case 'title':
            return sortByTitle(req, res);
        case '-createdAt':
            return sortNewestFirst(req, res);
        case 'createdAt':
            return sortOldestFirst(req, res);
        case 'views':
            return sortByViews(req, res);
        case 'bookmarks':
            return sortByBookmarks(req, res);
        case 'difficulty':
            return sortByDifficulty(req, res);
        case 'category':
            return sortByCategory(req, res);
        case 'language':
            return sortByLanguage(req, res);
        case 'popularity':
            return sortByPopularity(req, res);
        case 'updatedAt':
            return sortByUpdatedAt(req, res);
        default:
            // Fallback default sort
            return sortNewestFirst(req, res);
    }
});

module.exports = router;
