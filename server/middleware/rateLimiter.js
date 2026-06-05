// ============================================================
// MIDDLEWARE: Custom Rate Limiter (In-Memory)
// ============================================================

// Memory store for tracking requests
const store = new Map();

// Configuration
const WINDOW_MS = 60 * 1000; // 1 minute window
const MAX_LIMIT = 5; // Allow 5 requests per window

const rateLimiter = (req, res, next) => {
  const ip = req.ip || req.connection.remoteAddress || 'unknown';
  const now = Date.now();

  let clientData = store.get(ip);

  // If no data or window expired, reset client data
  if (!clientData || now > clientData.resetTime) {
    clientData = {
      count: 0,
      resetTime: now + WINDOW_MS,
    };
  }

  clientData.count += 1;
  store.set(ip, clientData);

  const remaining = Math.max(0, MAX_LIMIT - clientData.count);
  const resetSeconds = Math.ceil((clientData.resetTime - now) / 1000);

  // Set standard rate limit headers
  res.setHeader('X-RateLimit-Limit', MAX_LIMIT);
  res.setHeader('X-RateLimit-Remaining', remaining);
  res.setHeader('X-RateLimit-Reset', resetSeconds);

  // Check if limit exceeded
  if (clientData.count > MAX_LIMIT) {
    return res.status(429).json({
      success: false,
      error: 'Too many requests. Please try again later.',
      limit: MAX_LIMIT,
      remaining: 0,
      resetTimeSeconds: resetSeconds,
    });
  }

  // Attach rate limit status to request for demo endpoint use
  req.rateLimitInfo = {
    ip,
    limit: MAX_LIMIT,
    remaining,
    resetTimeSeconds: resetSeconds,
  };

  next();
};

module.exports = rateLimiter;
