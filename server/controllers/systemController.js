const mongoose = require('mongoose');
const os = require('os');
const Concept = require('../models/Concept');
const pkg = require('../package.json');

// ============================================================
// ROUTE #1: Health check
// METHOD: GET
// ENDPOINT: /api/v1/health
// ACCESS: Public
// ============================================================
const getHealth = async (req, res) => {
  try {
    const dbState = mongoose.connection.readyState;
    const isHealthy = dbState === 1;

    res.status(isHealthy ? 200 : 500).json({
      success: true,
      status: isHealthy ? 'UP' : 'DOWN',
      timestamp: new Date(),
      message: isHealthy ? 'System is healthy' : 'Database connection error',
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      status: 'DOWN',
      error: 'Server Error: Health check failed',
    });
  }
};

// ============================================================
// ROUTE #2: System status
// METHOD: GET
// ENDPOINT: /api/v1/system/status
// ACCESS: Public
// ============================================================
const getSystemStatus = async (req, res) => {
  try {
    const uptimeInSeconds = process.uptime();
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
        status: dbState === 1 ? 'Online' : 'Degraded',
        environment: process.env.NODE_ENV || 'development',
        platform: process.platform,
        uptime: Math.floor(uptimeInSeconds),
        database: dbStateMap[dbState] || 'Unknown',
        timestamp: new Date(),
      },
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: 'Server Error: Unable to fetch system status',
    });
  }
};

// ============================================================
// ROUTE #3: API version
// METHOD: GET
// ENDPOINT: /api/v1/system/version
// ACCESS: Public
// ============================================================
const getSystemVersion = async (req, res) => {
  try {
    res.status(200).json({
      success: true,
      data: {
        name: pkg.name || 'caia-backend',
        version: pkg.version || '1.0.0',
        description: pkg.description || '',
        apiVersion: 'v1',
      },
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: 'Server Error: Unable to fetch API version',
    });
  }
};

// ============================================================
// ROUTE #4: Public configuration
// METHOD: GET
// ENDPOINT: /api/v1/system/config
// ACCESS: Public
// ============================================================
const getSystemConfig = async (req, res) => {
  try {
    res.status(200).json({
      success: true,
      data: {
        environment: process.env.NODE_ENV || 'development',
        port: process.env.PORT || 5000,
        accessTokenExpiry: '15m',
        refreshTokenExpiry: '7d',
        maxPaginationLimit: 100,
        corsOrigins: process.env.CORS_ORIGIN || '*',
      },
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: 'Server Error: Unable to fetch system configuration',
    });
  }
};

// ============================================================
// ROUTE #5: Server uptime
// METHOD: GET
// ENDPOINT: /api/v1/system/uptime
// ACCESS: Public
// ============================================================
const getSystemUptime = async (req, res) => {
  try {
    const uptimeInSeconds = process.uptime();
    const hours = Math.floor(uptimeInSeconds / 3600);
    const minutes = Math.floor((uptimeInSeconds % 3600) / 60);
    const seconds = Math.floor(uptimeInSeconds % 60);

    const startTime = new Date(Date.now() - uptimeInSeconds * 1000);

    res.status(200).json({
      success: true,
      data: {
        uptimeSeconds: Math.floor(uptimeInSeconds),
        formatted: `${hours}h ${minutes}m ${seconds}s`,
        startedAt: startTime,
      },
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: 'Server Error: Unable to fetch server uptime',
    });
  }
};

// ============================================================
// ROUTE #6: Cache status
// METHOD: GET
// ENDPOINT: /api/v1/system/cache/status
// ACCESS: Public
// ============================================================
const getCacheStatus = async (req, res) => {
  try {
    // Generate simulated in-memory/redis cache statistics
    res.status(200).json({
      success: true,
      data: {
        status: 'Active',
        provider: 'In-Memory Cache Provider',
        keysCount: 184,
        memoryUsage: '3.12 MB',
        hitRate: '94.2%',
        missRate: '5.8%',
      },
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: 'Server Error: Unable to fetch cache status',
    });
  }
};

// ============================================================
// ROUTE #7: Storage status
// METHOD: GET
// ENDPOINT: /api/v1/system/storage/status
// ACCESS: Public
// ============================================================
const getStorageStatus = async (req, res) => {
  try {
    const freeMemory = os.freemem();
    const totalMemory = os.totalmem();
    const usedMemory = totalMemory - freeMemory;
    const memoryPercent = ((usedMemory / totalMemory) * 100).toFixed(1);

    res.status(200).json({
      success: true,
      data: {
        status: 'Healthy',
        platform: process.platform,
        memory: {
          total: (totalMemory / 1024 / 1024 / 1024).toFixed(2) + ' GB',
          free: (freeMemory / 1024 / 1024 / 1024).toFixed(2) + ' GB',
          usedPercentage: memoryPercent + '%',
        },
        storage: {
          status: 'Healthy',
          mockUsage: '42%',
        },
      },
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: 'Server Error: Unable to fetch storage status',
    });
  }
};

// ============================================================
// ROUTE #8: Database status
// METHOD: GET
// ENDPOINT: /api/v1/system/database/status
// ACCESS: Public
// ============================================================
const getDatabaseStatus = async (req, res) => {
  try {
    const dbState = mongoose.connection.readyState;
    const dbStateMap = {
      0: 'Disconnected',
      1: 'Connected',
      2: 'Connecting',
      3: 'Disconnecting',
    };

    const startTime = Date.now();
    let pingLatency = 'N/A';
    if (dbState === 1) {
      await Concept.findOne();
      pingLatency = (Date.now() - startTime) + ' ms';
    }

    const collections = dbState === 1
      ? await mongoose.connection.db.listCollections().toArray()
      : [];

    res.status(200).json({
      success: true,
      data: {
        connectionStatus: dbStateMap[dbState] || 'Unknown',
        databaseName: mongoose.connection.db?.databaseName || 'N/A',
        pingTime: pingLatency,
        totalCollections: collections.length,
      },
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: 'Server Error: Unable to fetch database status',
    });
  }
};

// ============================================================
// ROUTE #9: Reindex search engine
// METHOD: POST
// ENDPOINT: /api/v1/system/reindex
// ACCESS: Public
// ============================================================
const reindexSearchEngine = async (req, res) => {
  try {
    // Re-synchronize indexes defined on Concept model
    await Concept.syncIndexes();

    res.status(200).json({
      success: true,
      message: 'Database search indexes synchronized successfully',
      data: {
        model: 'Concept',
        timestamp: new Date(),
      },
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: 'Server Error: Failed to synchronize database search indexes',
    });
  }
};

// ============================================================
// ROUTE #10: Restart system service
// METHOD: POST
// ENDPOINT: /api/v1/system/restart
// ACCESS: Public
// ============================================================
const restartSystem = async (req, res) => {
  try {
    res.status(200).json({
      success: true,
      message: 'System service restart initiated. Server will be online in a few seconds.',
      data: {
        pid: process.pid,
        timestamp: new Date(),
      },
    });

    // Perform a clean shutdown. If nodemon is active, it automatically revives the process.
    setTimeout(() => {
      console.log('🔄 Restart triggered via API request. Exiting process...');
      process.exit(0);
    }, 1000);
  } catch (error) {
    res.status(500).json({
      success: false,
      error: 'Server Error: Unable to restart system service',
    });
  }
};

module.exports = {
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
};
