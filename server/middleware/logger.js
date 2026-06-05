// ============================================================
// MIDDLEWARE: Custom request logger
// ============================================================
const logger = (req, res, next) => {
  const start = Date.now();
  const timestamp = new Date().toISOString();
  const ip = req.ip || req.connection.remoteAddress || '';

  // Intercept the response finish event to calculate duration and status code
  res.on('finish', () => {
    const duration = Date.now() - start;
    const statusCode = res.statusCode;
    const logMsg = `[${timestamp}] [LOGGER] ${req.method} ${req.originalUrl || req.url} - ${statusCode} (${duration}ms) - IP: ${ip}`;
    console.log(logMsg);

    // Save details to the global / request log cache for API presentation
    req.logDetails = {
      timestamp,
      method: req.method,
      url: req.originalUrl || req.url,
      statusCode,
      duration: `${duration}ms`,
      ip,
    };
  });

  next();
};

module.exports = logger;
