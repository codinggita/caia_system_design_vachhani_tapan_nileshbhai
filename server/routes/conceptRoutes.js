const express = require('express');
const router = express.Router();
const {
    getConcepts,
    getConcept,
    createConcept,
    updateConcept,
    patchConcept,
    deleteConcept,
    getRandomConcept,
    getLatestConcepts,
    getTrendingConcepts,
    getPopularConcepts,
    getConceptSummary,
    archiveConcept,
    restoreConcept,
    getRelatedConcepts
} = require('../controllers/conceptController');

// ============================================================
// CONCEPT ROUTES
// ============================================================

// @route   GET /api/v1/concepts
// @desc    Fetch all concepts
router.get('/api/v1/concepts', getConcepts);

// @route   GET /api/v1/concepts/random
// @desc    Fetch random concept
router.get('/api/v1/concepts/random', getRandomConcept);

// @route   GET /api/v1/concepts/latest
// @desc    Fetch latest concepts
router.get('/api/v1/concepts/latest', getLatestConcepts);

// @route   GET /api/v1/concepts/trending
// @desc    Fetch trending concepts
router.get('/api/v1/concepts/trending', getTrendingConcepts);

// @route   GET /api/v1/concepts/popular
// @desc    Fetch popular concepts
router.get('/api/v1/concepts/popular', getPopularConcepts);

// @route   GET /api/v1/concepts/:id
// @desc    Fetch single concept
router.get('/api/v1/concepts/:id', getConcept);

// @route   POST /api/v1/concepts
// @desc    Create new concept
router.post('/api/v1/concepts', createConcept);

// @route   PUT /api/v1/concepts/:id
// @desc    Replace complete concept
router.put('/api/v1/concepts/:id', updateConcept);

// @route   PATCH /api/v1/concepts/:id
// @desc    Update specific concept fields
router.patch('/api/v1/concepts/:id', patchConcept);

// @route   DELETE /api/v1/concepts/:id
// @desc    Delete concept record
router.delete('/api/v1/concepts/:id', deleteConcept);

// @route   GET /api/v1/concepts/:id/summary
// @desc    Fetch concept summary
router.get('/api/v1/concepts/:id/summary', getConceptSummary);

// @route   PATCH /api/v1/concepts/:id/archive
// @desc    Archive concept
router.patch('/api/v1/concepts/:id/archive', archiveConcept);

// @route   PATCH /api/v1/concepts/:id/restore
// @desc    Restore archived concept
router.patch('/api/v1/concepts/:id/restore', restoreConcept);

// @route   GET /api/v1/concepts/:id/related
// @desc    Fetch related concepts
router.get('/api/v1/concepts/:id/related', getRelatedConcepts);

module.exports = router;
