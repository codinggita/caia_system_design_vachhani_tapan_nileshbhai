const jwt = require('jsonwebtoken');
const User = require('../models/User');

// ============================================================
// MIDDLEWARE: Protect routes — verify JWT access token
// ============================================================
const protect = async (req, res, next) => {
  let token;

  // 1. Check for token in Authorization header (Bearer token or raw token)
  if (req.headers.authorization) {
    if (req.headers.authorization.startsWith('Bearer ')) {
      token = req.headers.authorization.split(' ')[1];
    } else {
      // Fallback: If they pasted the raw token directly without "Bearer "
      token = req.headers.authorization.trim();
    }
  }

  // 2. Fallback: Check for token in cookies
  if (!token && req.cookies && req.cookies.accessToken) {
    token = req.cookies.accessToken;
  }

  // 3. If no token found, deny access
  if (!token) {
    return res.status(401).json({
      success: false,
      error: 'Not authorized — no token provided',
    });
  }

  try {
    // 4. Verify the token
    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    // 5. Attach user to request object (excluding password)
    req.user = await User.findById(decoded.id);

    if (!req.user) {
      return res.status(401).json({
        success: false,
        error: 'Not authorized — user no longer exists',
      });
    }

    // 5b. Block banned users
    if (req.user.isBanned) {
      return res.status(403).json({
        success: false,
        error: 'Access denied: Your account has been banned.',
      });
    }

    next();
  } catch (error) {
    return res.status(401).json({
      success: false,
      error: 'Not authorized — token is invalid or expired',
    });
  }
};

// ============================================================
// MIDDLEWARE: Authorize roles (e.g. 'admin')
// ============================================================
const authorize = (...roles) => {
  return (req, res, next) => {
    if (!req.user || !roles.includes(req.user.role)) {
      return res.status(403).json({
        success: false,
        error: `Access denied: User role '${req.user ? req.user.role : 'none'}' is not authorized to access this route.`,
      });
    }
    next();
  };
};

// ============================================================
// MIDDLEWARE: Maintenance mode check
// Blocks requests if global.maintenanceMode is true and user is not admin
// ============================================================
const checkMaintenance = async (req, res, next) => {
  if (global.maintenanceMode) {
    // Crucial authentication routes must remain open so admins can log in
    const isAuthRoute =
      req.originalUrl.includes('/api/v1/auth/login') ||
      req.originalUrl.includes('/api/v1/auth/register') ||
      req.originalUrl.includes('/api/v1/auth/refresh-token');
    const isAdminRoute = req.originalUrl.includes('/api/v1/admin');

    if (!isAuthRoute && !isAdminRoute) {
      let isAdmin = false;
      try {
        let token;
        if (req.headers.authorization) {
          if (req.headers.authorization.startsWith('Bearer ')) {
            token = req.headers.authorization.split(' ')[1];
          } else {
            token = req.headers.authorization.trim();
          }
        }
        if (!token && req.cookies && req.cookies.accessToken) {
          token = req.cookies.accessToken;
        }

        if (token) {
          const decoded = jwt.verify(token, process.env.JWT_SECRET);
          const user = await User.findById(decoded.id);
          if (user && user.role === 'admin') {
            isAdmin = true;
          }
        }
      } catch (err) {
        // Fail silently and treat as non-admin
      }

      if (!isAdmin) {
        return res.status(503).json({
          success: false,
          error: 'System is currently undergoing maintenance. Please try again later.',
        });
      }
    }
  }
  next();
};

module.exports = { protect, authorize, checkMaintenance };
