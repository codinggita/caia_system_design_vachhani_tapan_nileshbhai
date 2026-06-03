const express = require('express');
const router = express.Router();
const {
  getUsers,
  getUser,
  updateUserRole,
  banUser,
  unbanUser,
  getAuditLogs,
  getSystemHealth,
  getSystemLogs,
  clearCache,
  toggleMaintenanceMode,
} = require('../controllers/adminController');
const { protect, authorize } = require('../middleware/auth');

// Apply protect & authorize('admin') middleware to all routes in this file
router.use(protect);
router.use(authorize('admin'));

// ============================================================
// ADMIN USER MANAGEMENT ROUTES
// ============================================================

// @route   GET /api/v1/admin/users
// @desc    Fetch all users in database
// @access  Private (Admin Only)
router.get('/api/v1/admin/users', getUsers);

// @route   GET /api/v1/admin/users/:id
// @desc    Fetch details of a single user
// @access  Private (Admin Only)
router.get('/api/v1/admin/users/:id', getUser);

// @route   PATCH /api/v1/admin/users/:id/role
// @desc    Update a user's role (admin, user)
// @access  Private (Admin Only)
router.patch('/api/v1/admin/users/:id/role', updateUserRole);

// @route   PATCH /api/v1/admin/users/:id/ban
// @desc    Ban a user's account
// @access  Private (Admin Only)
router.patch('/api/v1/admin/users/:id/ban', banUser);

// @route   PATCH /api/v1/admin/users/:id/unban
// @desc    Unban a user's account
// @access  Private (Admin Only)
router.patch('/api/v1/admin/users/:id/unban', unbanUser);

// ============================================================
// ADMIN SYSTEM & AUDITING ROUTES
// ============================================================

// @route   GET /api/v1/admin/logs
// @desc    Fetch admin action audit logs
// @access  Private (Admin Only)
router.get('/api/v1/admin/logs', getAuditLogs);

// @route   GET /api/v1/admin/system/health
// @desc    Fetch system hardware, process & database health stats
// @access  Private (Admin Only)
router.get('/api/v1/admin/system/health', getSystemHealth);

// @route   GET /api/v1/admin/system/logs
// @desc    Fetch simulated application console/server logs
// @access  Private (Admin Only)
router.get('/api/v1/admin/system/logs', getSystemLogs);

// @route   DELETE /api/v1/admin/cache/clear
// @desc    Clear system-wide memory caches
// @access  Private (Admin Only)
router.delete('/api/v1/admin/cache/clear', clearCache);

// @route   POST /api/v1/admin/system/maintenance
// @desc    Toggle system maintenance mode
// @access  Private (Admin Only)
router.post('/api/v1/admin/system/maintenance', toggleMaintenanceMode);

module.exports = router;
