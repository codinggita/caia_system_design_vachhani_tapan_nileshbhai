// ============================================================
// MIDDLEWARE: Custom Response Compression (Gzip / Deflate)
// ============================================================
const zlib = require('zlib');

const compression = (req, res, next) => {
  const acceptEncoding = req.headers['accept-encoding'] || '';

  // Intercept the res.send function
  const originalSend = res.send;

  res.send = function (body) {
    let chunk = body;

    // Convert object or other types to string and set Content-Type header if needed
    if (typeof chunk === 'object' && chunk !== null && !Buffer.isBuffer(chunk)) {
      chunk = JSON.stringify(chunk);
      res.setHeader('Content-Type', 'application/json; charset=utf-8');
    } else if (typeof chunk === 'string') {
      if (!res.getHeader('Content-Type')) {
        res.setHeader('Content-Type', 'text/html; charset=utf-8');
      }
    }

    if (!chunk) {
      return originalSend.call(this, body);
    }

    const buffer = Buffer.isBuffer(chunk) ? chunk : Buffer.from(chunk, 'utf-8');

    // Compress based on accepted client encodings
    if (acceptEncoding.includes('gzip')) {
      res.setHeader('Content-Encoding', 'gzip');
      const compressed = zlib.gzipSync(buffer);
      
      // Remove any previously calculated content length and set actual compressed length
      res.setHeader('Content-Length', compressed.length);
      return res.end(compressed);
    } else if (acceptEncoding.includes('deflate')) {
      res.setHeader('Content-Encoding', 'deflate');
      const compressed = zlib.deflateSync(buffer);
      
      res.setHeader('Content-Length', compressed.length);
      return res.end(compressed);
    }

    // If no supported compression is requested, fallback to sending uncompressed data
    return originalSend.call(this, chunk);
  };

  next();
};

module.exports = compression;
