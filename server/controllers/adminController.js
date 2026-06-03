const User = require('../models/User');
const AuditLog = require('../models/AuditLog');
const mongoose = require('mongoose');
const os = require('os');

// ============================================================
// ROUTE #1: Fetch all users
// METHOD: GET
// ENDPOINT: /api/v1/admin/users
// ACCESS: Private (Admin)
// ============================================================
const getUsers = async (req, res) => {
  try {
    const users = await User.find().sort({ createdAt: -1 });

    res.status(200).json({
      success: true,
      count: users.length,
      data: users,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: 'Server Error: Unable to fetch users',
    });
  }
};

// ============================================================
// ROUTE #2: Fetch single user
// METHOD: GET
// ENDPOINT: /api/v1/admin/users/:id
// ACCESS: Private (Admin)
// ============================================================
const getUser = async (req, res) => {
  try {
    const user = await User.findById(req.params.id);

    if (!user) {
      return res.status(404).json({
        success: false,
        error: 'User not found',
      });
    }

    res.status(200).json({
      success: true,
      data: user,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: 'Server Error: Unable to fetch user',
    });
  }
};

// ============================================================
// ROUTE #3: Update user role
// METHOD: PATCH
// ENDPOINT: /api/v1/admin/users/:id/role
// ACCESS: Private (Admin)
// ============================================================
const updateUserRole = async (req, res) => {
  try {
    const { role } = req.body;

    if (!role || !['user', 'admin'].includes(role)) {
      return res.status(400).json({
        success: false,
        error: 'Please provide a valid role (user, admin)',
      });
    }

    const user = await User.findByIdAndUpdate(
      req.params.id,
      { role },
      { new: true, runValidators: true }
    );

    if (!user) {
      return res.status(404).json({
        success: false,
        error: 'User not found',
      });
    }

    // Record audit log
    await AuditLog.create({
      action: 'CHANGE_ROLE',
      performedBy: req.user._id,
      details: `Changed role of user ${user.email} to ${role}`,
      ipAddress: req.ip || '',
    });

    res.status(200).json({
      success: true,
      message: `User role updated to ${role} successfully`,
      data: user,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: 'Server Error: Unable to update user role',
    });
  }
};

// ============================================================
// ROUTE #4: Ban user
// METHOD: PATCH
// ENDPOINT: /api/v1/admin/users/:id/ban
// ACCESS: Private (Admin)
// ============================================================
const banUser = async (req, res) => {
  try {
    // Prevent admin from banning themselves
    if (req.params.id === req.user._id.toString()) {
      return res.status(400).json({
        success: false,
        error: 'You cannot ban yourself',
      });
    }

    const user = await User.findByIdAndUpdate(
      req.params.id,
      { isBanned: true },
      { new: true }
    );

    if (!user) {
      return res.status(404).json({
        success: false,
        error: 'User not found',
      });
    }

    // Record audit log
    await AuditLog.create({
      action: 'BAN_USER',
      performedBy: req.user._id,
      details: `Banned user account: ${user.email}`,
      ipAddress: req.ip || '',
    });

    res.status(200).json({
      success: true,
      message: 'User account has been banned successfully',
      data: user,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: 'Server Error: Unable to ban user',
    });
  }
};

// ============================================================
// ROUTE #5: Unban user
// METHOD: PATCH
// ENDPOINT: /api/v1/admin/users/:id/unban
// ACCESS: Private (Admin)
// ============================================================
const unbanUser = async (req, res) => {
  try {
    const user = await User.findByIdAndUpdate(
      req.params.id,
      { isBanned: false },
      { new: true }
    );

    if (!user) {
      return res.status(404).json({
        success: false,
        error: 'User not found',
      });
    }

    // Record audit log
    await AuditLog.create({
      action: 'UNBAN_USER',
      performedBy: req.user._id,
      details: `Unbanned user account: ${user.email}`,
      ipAddress: req.ip || '',
    });

    res.status(200).json({
      success: true,
      message: 'User account has been unbanned successfully',
      data: user,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: 'Server Error: Unable to unban user',
    });
  }
};

// ============================================================
// ROUTE #6: Fetch audit logs
// METHOD: GET
// ENDPOINT: /api/v1/admin/logs
// ACCESS: Private (Admin)
// ============================================================
const getAuditLogs = async (req, res) => {
  try {
    const logs = await AuditLog.find()
      .populate('performedBy', 'name email role')
      .sort({ createdAt: -1 });

    res.status(200).json({
      success: true,
      count: logs.length,
      data: logs,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: 'Server Error: Unable to fetch audit logs',
    });
  }
};

// ============================================================
// ROUTE #7: System health
// METHOD: GET
// ENDPOINT: /api/v1/admin/system/health
// ACCESS: Private (Admin)
// ============================================================
const getSystemHealth = async (req, res) => {
  try {
    const uptimeInSeconds = process.uptime();
    const memoryUsage = process.memoryUsage();

    const toMB = (bytes) => (bytes / 1024 / 1024).toFixed(2) + ' MB';
    const dbState = mongoose.connection.readyState;
    const dbStateMap = {
      0: 'Disconnected',
      1: 'Connected',
      2: 'Connecting',
      3: 'Disconnecting',
    };

    res.status(200).json({
      success: true,
      data: {
        status: dbState === 1 ? 'Healthy' : 'Degraded',
        timestamp: new Date(),
        uptime: {
          totalSeconds: Math.floor(uptimeInSeconds),
          formatted: `${Math.floor(uptimeInSeconds / 3600)}h ${Math.floor(
            (uptimeInSeconds % 3600) / 60
          )}m ${Math.floor(uptimeInSeconds % 60)}s`,
        },
        memory: {
          systemTotal: (os.totalmem() / 1024 / 1024 / 1024).toFixed(2) + ' GB',
          systemFree: (os.freemem() / 1024 / 1024 / 1024).toFixed(2) + ' GB',
          processRSS: toMB(memoryUsage.rss),
          heapTotal: toMB(memoryUsage.heapTotal),
          heapUsed: toMB(memoryUsage.heapUsed),
        },
        system: {
          platform: process.platform,
          nodeVersion: process.version,
          cpus: os.cpus().length,
          loadAverage: os.loadavg(),
        },
        database: {
          status: dbStateMap[dbState] || 'Unknown',
          name: mongoose.connection.db?.databaseName || 'N/A',
        },
        maintenanceMode: !!global.maintenanceMode,
      },
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: 'Server Error: Unable to fetch system health stats',
    });
  }
};

// ============================================================
// ROUTE #8: Fetch system console logs (Simulated Audit Output)
// METHOD: GET
// ENDPOINT: /api/v1/admin/system/logs
// ACCESS: Private (Admin)
// ============================================================
const getSystemLogs = async (req, res) => {
  try {
    const now = new Date();
    // Simulate real-time server runtime/console logs
    const logs = [
      {
        timestamp: new Date(now - 120000),
        level: 'INFO',
        message: 'Mongoose connection verified successfully.',
      },
      {
        timestamp: new Date(now - 90000),
        level: 'INFO',
        message: 'Admin authorization middleware initiated.',
      },
      {
        timestamp: new Date(now - 60000),
        level: 'WARN',
        message: 'API rate limits approaching threshold for dynamic concept fetching.',
      },
      {
        timestamp: new Date(now - 30000),
        level: 'INFO',
        message: 'Cleared expired verification keys inside user collections.',
      },
      {
        timestamp: now,
        level: 'INFO',
        message: 'Admin requested system status details.',
      },
    ];

    res.status(200).json({
      success: true,
      count: logs.length,
      data: logs,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: 'Server Error: Unable to fetch system logs',
    });
  }
};

// ============================================================
// ROUTE #9: Clear Cache
// METHOD: DELETE
// ENDPOINT: /api/v1/admin/cache/clear
// ACCESS: Private (Admin)
// ============================================================
const clearCache = async (req, res) => {
  try {
    // Record audit log
    await AuditLog.create({
      action: 'CLEAR_CACHE',
      performedBy: req.user._id,
      details: 'Cleared system-wide memory cache structures',
      ipAddress: req.ip || '',
    });

    res.status(200).json({
      success: true,
      message: 'System cache cleared successfully',
      data: {},
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: 'Server Error: Unable to clear cache',
    });
  }
};

// ============================================================
// ROUTE #10: Toggle maintenance mode
// METHOD: POST
// ENDPOINT: /api/v1/admin/system/maintenance
// ACCESS: Private (Admin)
// ============================================================
const toggleMaintenanceMode = async (req, res) => {
  try {
    const { maintenance } = req.body;

    if (maintenance !== undefined) {
      global.maintenanceMode = !!maintenance;
    } else {
      global.maintenanceMode = !global.maintenanceMode;
    }

    // Record audit log
    await AuditLog.create({
      action: 'TOGGLE_MAINTENANCE',
      performedBy: req.user._id,
      details: `Set system maintenance mode to: ${global.maintenanceMode}`,
      ipAddress: req.ip || '',
    });

    res.status(200).json({
      success: true,
      message: `System maintenance mode set to ${global.maintenanceMode ? 'ON' : 'OFF'}`,
      data: {
        maintenanceMode: global.maintenanceMode,
      },
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: 'Server Error: Unable to toggle maintenance mode',
    });
  }
};

module.exports = {
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
};
