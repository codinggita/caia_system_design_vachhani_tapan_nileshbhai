const express = require('express');
const router = express.Router();
const {
    filterByCategory,
    filterByDifficulty,
    filterByPattern,
    filterByLanguage
} = require('../controllers/filterController');

// @route   GET /api/v1/filter/category?name=Microservices
router.get('/api/v1/filter/category', filterByCategory);

// @route   GET /api/v1/filter/difficulty?level=beginner
router.get('/api/v1/filter/difficulty', filterByDifficulty);

// @route   GET /api/v1/filter/pattern?name=Saga
router.get('/api/v1/filter/pattern', filterByPattern);

// @route   GET /api/v1/filter/language?name=Go
router.get('/api/v1/filter/language', filterByLanguage);

module.exports = router;
