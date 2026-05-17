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
    getRelatedConcepts,
    getAllCategories,
    getCategoryDetails,
    getConceptsByCategory,
    getAllSubcategories,
    getAllTags,
    getConceptsByTag,
    getAllPatterns,
    getConceptsByPattern,
    getAllLanguages,
    getConceptsByLanguage,
    getAllDifficulties,
    getConceptsByDifficulty,
    getAllQuestionTypes,
    getConceptsByQuestionType
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

// ============================================================
// CATEGORY ROUTES
// ============================================================

// @route   GET /api/v1/categories
// @desc    Fetch all unique architecture categories
router.get('/api/v1/categories', getAllCategories);

// @route   GET /api/v1/categories/:category
// @desc    Fetch category details (stats)
router.get('/api/v1/categories/:category', getCategoryDetails);

// @route   GET /api/v1/categories/:category/concepts
// @desc    Fetch concepts under a specific category
router.get('/api/v1/categories/:category/concepts', getConceptsByCategory);

// ============================================================
// SUBCATEGORY & TAG ROUTES
// ============================================================

// @route   GET /api/v1/subcategories
// @desc    Fetch all unique architecture subcategories
router.get('/api/v1/subcategories', getAllSubcategories);

// @route   GET /api/v1/tags
// @desc    Fetch all unique architecture tags
router.get('/api/v1/tags', getAllTags);

// @route   GET /api/v1/tags/:tag
// @desc    Fetch concepts by tag
router.get('/api/v1/tags/:tag', getConceptsByTag);

// ============================================================
// PATTERN ROUTES
// ============================================================

// @route   GET /api/v1/patterns
// @desc    Fetch all unique architecture patterns
router.get('/api/v1/patterns', getAllPatterns);

// @route   GET /api/v1/patterns/:pattern
// @desc    Fetch concepts by architecture pattern
router.get('/api/v1/patterns/:patternName', getConceptsByPattern);

// ============================================================
// LANGUAGE ROUTES
// ============================================================

// @route   GET /api/v1/languages
// @desc    Fetch all unique programming languages
router.get('/api/v1/languages', getAllLanguages);

// @route   GET /api/v1/languages/:language
// @desc    Fetch concepts by programming language
router.get('/api/v1/languages/:language', getConceptsByLanguage);

// ============================================================
// DIFFICULTY ROUTES
// ============================================================

// @route   GET /api/v1/difficulty
// @desc    Fetch all unique difficulty levels
router.get('/api/v1/difficulty', getAllDifficulties);

// @route   GET /api/v1/difficulty/:level
// @desc    Fetch concepts by difficulty level
router.get('/api/v1/difficulty/:level', getConceptsByDifficulty);

// ============================================================
// QUESTION TYPE ROUTES
// ============================================================

// @route   GET /api/v1/question-type
// @desc    Fetch all unique question types
router.get('/api/v1/question-type', getAllQuestionTypes);

// @route   GET /api/v1/question-type/:type
// @desc    Fetch concepts by question type
router.get('/api/v1/question-type/:type', getConceptsByQuestionType);

module.exports = router;
