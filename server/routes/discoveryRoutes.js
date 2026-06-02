const express = require('express');
const router = express.Router();
const {
    getBackendRoadmap,
    getFrontendRoadmap,
    getDevopsRoadmap,
    getSystemDesignRoadmap,
    suggestNextConcept,
    getPersonalizedRecommendations,
    getTrendingConcepts,
    getHiddenGems,
    getExpertPicks,
    getDailyChallenge
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

// 6. GET /api/v1/discovery/recommended/:userId
router.get('/api/v1/discovery/recommended/:userId', getPersonalizedRecommendations);

// 7. GET /api/v1/discovery/trending
router.get('/api/v1/discovery/trending', getTrendingConcepts);

// 8. GET /api/v1/discovery/hidden-gems
router.get('/api/v1/discovery/hidden-gems', getHiddenGems);

// 9. GET /api/v1/discovery/expert-picks
router.get('/api/v1/discovery/expert-picks', getExpertPicks);

// 10. GET /api/v1/discovery/daily-challenge
router.get('/api/v1/discovery/daily-challenge', getDailyChallenge);

module.exports = router;

