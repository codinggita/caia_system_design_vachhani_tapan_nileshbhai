const express = require('express');
const router = express.Router();
const { getConcepts } = require('../controllers/conceptController');

// @route   GET /api/v1/concepts
router.get('/api/v1/concepts', getConcepts);

module.exports = router;
