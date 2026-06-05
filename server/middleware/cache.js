// ============================================================
// MIDDLEWARE: Custom Cache Middleware (In-Memory)
// ============================================================

const cacheStore = new Map();
const DEFAULT_TTL = 10 * 1000; // 10 seconds TTL

const cacheMiddleware = (ttl = DEFAULT_TTL) => {
  return (req, res, next) => {
    // Only cache GET requests
    if (req.method !== 'GET') {
      return next();
    }

    const key = req.originalUrl || req.url;
    const now = Date.now();
    const cachedData = cacheStore.get(key);

    if (cachedData && now < cachedData.expiresAt) {
      // Set Cache Hit Header
      res.setHeader('X-Cache', 'HIT');
      res.setHeader('X-Cache-Expires-In', Math.ceil((cachedData.expiresAt - now) / 1000) + 's');
      
      // Try to parse cached body as JSON if appropriate
      let bodyToReturn = cachedData.body;
      try {
        bodyToReturn = JSON.parse(cachedData.body);
      } catch (err) {
        // Keep as string if not JSON
      }
      
      return res.json({
        success: true,
        cached: true,
        cachedAt: new Date(cachedData.cachedAt),
        expiresAt: new Date(cachedData.expiresAt),
        data: bodyToReturn,
      });
    }

    // Set Cache Miss Header
    res.setHeader('X-Cache', 'MISS');

    // Intercept response send to save body to cache
    const originalJson = res.json;
    res.json = function (body) {
      // Only cache successful JSON responses
      if (res.statusCode >= 200 && res.statusCode < 300) {
        // Handle cases where body is already a string or object
        const bodyString = typeof body === 'object' ? JSON.stringify(body) : body;

        cacheStore.set(key, {
          body: bodyString,
          cachedAt: now,
          expiresAt: now + ttl,
        });
      }
      return originalJson.call(this, body);
    };

    next();
  };
};

module.exports = cacheMiddleware;
