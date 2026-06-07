const express = require('express');
const router = express.Router();

const {
  validateConcept,
  validateConceptUpdate,
  validateSearch,
  validateTags,
  validateUpload,
  simulateNotFound,
  simulateServerError,
  simulateDatabaseError,
  simulateValidationError,
  simulateTokenExpired
} = require('../controllers/validationController');

// ============================================================
// VALIDATION ROUTES
// ============================================================

// @route   POST /api/v1/validate/concept
// @desc    Validate concept payload
// @access  Public
router.post('/api/v1/validate/concept', validateConcept);

// @route   PATCH /api/v1/validate/concept/:id
// @desc    Validate update payload
// @access  Public
router.patch('/api/v1/validate/concept/:id', validateConceptUpdate);

// @route   POST /api/v1/validate/search
// @desc    Validate search payload
// @access  Public
router.post('/api/v1/validate/search', validateSearch);

// @route   POST /api/v1/validate/tags
// @desc    Validate tags array payload
// @access  Public
router.post('/api/v1/validate/tags', validateTags);

// @route   POST /api/v1/validate/upload
// @desc    Validate file upload metadata payload
// @access  Public
router.post('/api/v1/validate/upload', validateUpload);

// ============================================================
// ERROR SIMULATION ROUTES
// ============================================================

// @route   GET /api/v1/errors/not-found
// @desc    Simulate 404 resource not found error
// @access  Public
router.get('/api/v1/errors/not-found', simulateNotFound);

// @route   GET /api/v1/errors/server-error
// @desc    Simulate 500 internal server error
// @access  Public
router.get('/api/v1/errors/server-error', simulateServerError);

// @route   GET /api/v1/errors/database
// @desc    Simulate database connection/query error
// @access  Public
router.get('/api/v1/errors/database', simulateDatabaseError);

// @route   GET /api/v1/errors/validation
// @desc    Simulate validation error response
// @access  Public
router.get('/api/v1/errors/validation', simulateValidationError);

// @route   GET /api/v1/errors/token-expired
// @desc    Simulate expired JWT token error response
// @access  Public
router.get('/api/v1/errors/token-expired', simulateTokenExpired);

module.exports = router;
