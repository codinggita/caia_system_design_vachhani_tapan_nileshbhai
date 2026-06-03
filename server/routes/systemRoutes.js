const express = require('express');
const router = express.Router();
const {
  getHealth,
  getSystemStatus,
  getSystemVersion,
  getSystemConfig,
  getSystemUptime,
  getCacheStatus,
  getStorageStatus,
  getDatabaseStatus,
  reindexSearchEngine,
  restartSystem,
} = require('../controllers/systemController');

// ============================================================
// SYSTEM & UTILITY ROUTES
// ============================================================

// @route   GET /api/v1/health
// @desc    System health check status
// @access  Public
router.get('/api/v1/health', getHealth);

// @route   GET /api/v1/system/status
// @desc    Comprehensive system status statistics
// @access  Public
router.get('/api/v1/system/status', getSystemStatus);

// @route   GET /api/v1/system/version
// @desc    Retrieve API name and build version
// @access  Public
router.get('/api/v1/system/version', getSystemVersion);

// @route   GET /api/v1/system/config
// @desc    Retrieve public configuration settings
// @access  Public
router.get('/api/v1/system/config', getSystemConfig);

// @route   GET /api/v1/system/uptime
// @desc    Retrieve server operational uptime metrics
// @access  Public
router.get('/api/v1/system/uptime', getSystemUptime);

// @route   GET /api/v1/system/cache/status
// @desc    Retrieve system memory cache hit/miss rates and state
// @access  Public
router.get('/api/v1/system/cache/status', getCacheStatus);

// @route   GET /api/v1/system/storage/status
// @desc    Retrieve server hardware memory and disk volumes info
// @access  Public
router.get('/api/v1/system/storage/status', getStorageStatus);

// @route   GET /api/v1/system/database/status
// @desc    Retrieve database latency and connections health check
// @access  Public
router.get('/api/v1/system/database/status', getDatabaseStatus);

// @route   POST /api/v1/system/reindex
// @desc    Re-synchronize and index search engine schema
// @access  Public
router.post('/api/v1/system/reindex', reindexSearchEngine);

// @route   POST /api/v1/system/restart
// @desc    Restart system service process gracefully
// @access  Public
router.post('/api/v1/system/restart', restartSystem);

module.exports = router;
