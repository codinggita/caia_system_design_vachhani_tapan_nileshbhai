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

    next();
  } catch (error) {
    return res.status(401).json({
      success: false,
      error: 'Not authorized — token is invalid or expired',
    });
  }
};

module.exports = { protect };
