const express = require('express');
const router = express.Router();
const { 
    getBackendRoadmap, 
    getFrontendRoadmap, 
    getDevopsRoadmap, 
    getSystemDesignRoadmap, 
    suggestNextConcept 
} = require('../controllers/discoveryController');

// 1. GET /api/v1/discovery/roadmap/backend
router.get('/api/v1/discovery/roadmap/backend', getBackendRoadmap);

// 2. GET /api/v1/discovery/roadmap/frontend
router.get('/api/v1/discovery/roadmap/frontend', getFrontendRoadmap);

// 3. GET /api/v1/discovery/roadmap/devops
router.get('/api/v1/discovery/roadmap/devops', getDevopsRoadmap);

// 4. GET /api/v1/discovery/roadmap/system-design
router.get('/api/v1/discovery/roadmap/system-design', getSystemDesignRoadmap);

// 5. GET /api/v1/discovery/suggest-next/:id
router.get('/api/v1/discovery/suggest-next/:id', suggestNextConcept);

module.exports = router;
