const Concept = require('../models/Concept');
const User = require('../models/User');
const AuditLog = require('../models/AuditLog');
const mongoose = require('mongoose');
const os = require('os');

// ============================================================
// 1. PROTECTED ROUTE: Fetch concepts
// METHOD: GET | ENDPOINT: /api/v1/protected/concepts
// ============================================================
const getProtectedConcepts = async (req, res) => {
  try {
    const concepts = await Concept.find().populate('author', 'name email role');
    res.status(200).json({
      success: true,
      count: concepts.length,
      data: concepts,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: 'Server Error: Unable to fetch protected concepts',
    });
  }
};

// ============================================================
// 2. PROTECTED ROUTE: Create concept
// METHOD: POST | ENDPOINT: /api/v1/protected/concepts
// ============================================================
const createProtectedConcept = async (req, res) => {
  try {
    // Set author field to the authenticated user's ID
    req.body.author = req.user._id;

    const concept = await Concept.create(req.body);

    // Record audit log
    await AuditLog.create({
      action: 'CREATE_CONCEPT_PROTECTED',
      performedBy: req.user._id,
      details: `Created concept "${concept.title}" via protected route`,
      ipAddress: req.ip || '',
    });

    res.status(201).json({
      success: true,
      message: 'Concept created successfully via protected route',
      data: concept,
    });
  } catch (error) {
    if (error.name === 'ValidationError') {
      const messages = Object.values(error.errors).map((val) => val.message);
      return res.status(400).json({
        success: false,
        error: messages,
      });
    }
    res.status(500).json({
      success: false,
      error: 'Server Error: Could not create protected concept',
    });
  }
};

// ============================================================
// 3. PROTECTED ROUTE: Update concept
// METHOD: PATCH | ENDPOINT: /api/v1/protected/concepts/:id
// ============================================================
const updateProtectedConcept = async (req, res) => {
  try {
    const concept = await Concept.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true,
    });

    if (!concept) {
      return res.status(404).json({
        success: false,
        error: 'Concept not found',
      });
    }

    // Record audit log
    await AuditLog.create({
      action: 'UPDATE_CONCEPT_PROTECTED',
      performedBy: req.user._id,
      details: `Updated concept "${concept.title}" via protected route`,
      ipAddress: req.ip || '',
    });

    res.status(200).json({
      success: true,
      message: 'Concept updated successfully via protected route',
      data: concept,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: 'Server Error: Could not update protected concept',
    });
  }
};

// ============================================================
// 4. PROTECTED ROUTE: Delete concept
// METHOD: DELETE | ENDPOINT: /api/v1/protected/concepts/:id
// ============================================================
const deleteProtectedConcept = async (req, res) => {
  try {
    const concept = await Concept.findById(req.params.id);

    if (!concept) {
      return res.status(404).json({
        success: false,
        error: 'Concept not found',
      });
    }

    await concept.deleteOne();

    // Record audit log
    await AuditLog.create({
      action: 'DELETE_CONCEPT_PROTECTED',
      performedBy: req.user._id,
      details: `Deleted concept ID: ${req.params.id} via protected route`,
      ipAddress: req.ip || '',
    });

    res.status(200).json({
      success: true,
      message: 'Concept deleted successfully via protected route',
      data: {},
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: 'Server Error: Could not delete protected concept',
    });
  }
};

// ============================================================
// 5. PROTECTED ROUTE: Admin dashboard
// METHOD: GET | ENDPOINT: /api/v1/admin/protected/dashboard
// ============================================================
const getAdminProtectedDashboard = async (req, res) => {
  try {
    const totalConcepts = await Concept.countDocuments();
    const totalUsers = await User.countDocuments();
    const totalAuditLogs = await AuditLog.countDocuments();
    
    // Fetch last 5 audit logs
    const latestLogs = await AuditLog.find()
      .populate('performedBy', 'name email role')
      .sort({ createdAt: -1 })
      .limit(5);

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
        systemMetrics: {
          uptime: Math.floor(process.uptime()),
          nodeVersion: process.version,
          platform: process.platform,
          memoryUsage: {
            heapUsed: (process.memoryUsage().heapUsed / 1024 / 1024).toFixed(2) + ' MB',
            heapTotal: (process.memoryUsage().heapTotal / 1024 / 1024).toFixed(2) + ' MB',
          },
        },
        database: {
          status: dbStateMap[dbState] || 'Unknown',
          name: mongoose.connection.db?.databaseName || 'N/A',
        },
        dashboardCounters: {
          totalConcepts,
          totalUsers,
          totalAuditLogs,
        },
        recentAuditLogs: latestLogs,
      },
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: 'Server Error: Unable to fetch protected admin dashboard',
    });
  }
};

// ============================================================
// 6. DEMO ROUTE: Logger middleware check
// METHOD: GET | ENDPOINT: /api/v1/middleware/logger
// ============================================================
const getLoggerDemo = (req, res) => {
  // Access details set during request start, but we can return confirmation
  res.status(200).json({
    success: true,
    message: 'Logger middleware executed successfully. Details have been logged to the server console.',
    logDetails: req.logDetails || {
      note: 'The logger details are printed on response completion. This object contains default config values.',
      active: true,
      provider: 'ConsoleLogger',
    },
  });
};

// ============================================================
// 7. DEMO ROUTE: Auth middleware check
// METHOD: GET | ENDPOINT: /api/v1/middleware/auth
// ============================================================
const getAuthDemo = (req, res) => {
  res.status(200).json({
    success: true,
    message: 'Auth middleware verification passed. JWT token is valid.',
    user: {
      id: req.user._id,
      name: req.user.name,
      email: req.user.email,
      role: req.user.role,
    },
  });
};

// ============================================================
// 8. DEMO ROUTE: Rate Limiting middleware check
// METHOD: GET | ENDPOINT: /api/v1/middleware/rate-limit
// ============================================================
const getRateLimitDemo = (req, res) => {
  res.status(200).json({
    success: true,
    message: 'Rate limiting check passed. Request has been allowed.',
    rateLimitInfo: req.rateLimitInfo || {},
  });
};

// ============================================================
// 9. DEMO ROUTE: Cache middleware check
// METHOD: GET | ENDPOINT: /api/v1/middleware/cache
// ============================================================
const getCacheDemo = (req, res) => {
  res.status(200).json({
    timestamp: new Date().toISOString(),
    message: 'This response has been dynamically generated and cached.',
    serverProcessPID: process.pid,
    randomSeed: Math.floor(Math.random() * 1000000),
  });
};

// ============================================================
// 10. DEMO ROUTE: Compression middleware check
// METHOD: GET | ENDPOINT: /api/v1/middleware/compression
// ============================================================
const getCompressionDemo = (req, res) => {
  // Generate a large JSON payload (around 50KB uncompressed)
  const largeData = Array.from({ length: 150 }).map((_, i) => ({
    id: i + 1,
    title: `Scalability Pattern Concept Item #${i + 1}`,
    description: 'System design represents the process of defining the architecture, interfaces, modules, and data for a system to satisfy specified requirements. High scalability is achieved through horizontal load distribution, request rate throttling, persistent memory indexing, caching strategies, and data chunk compression.',
    category: 'Advanced Architecture',
    tags: ['scalability', 'fault-tolerance', 'caching', 'load-balancing', 'compression'],
    meta: {
      indexId: i,
      active: true,
      timestamp: new Date(),
    },
  }));

  const payloadString = JSON.stringify(largeData);
  const sizeInBytes = Buffer.byteLength(payloadString, 'utf-8');

  res.status(200).json({
    success: true,
    message: 'This endpoint returns a large payload to demonstrate the benefits of Gzip / Deflate compression.',
    compressionInfo: {
      uncompressedSize: `${(sizeInBytes / 1024).toFixed(2)} KB`,
      uncompressedBytes: sizeInBytes,
      note: 'Observe the "Content-Encoding" and "Content-Length" headers in your browser network logs or API client response.',
    },
    data: largeData,
  });
};

module.exports = {
  getProtectedConcepts,
  createProtectedConcept,
  updateProtectedConcept,
  deleteProtectedConcept,
  getAdminProtectedDashboard,
  getLoggerDemo,
  getAuthDemo,
  getRateLimitDemo,
  getCacheDemo,
  getCompressionDemo,
};
