const express = require('express');
const dotenv = require('dotenv');
const cors = require('cors');
const cookieParser = require('cookie-parser');
const connectDB = require('./config/db');

// Load environment variables
dotenv.config();

// Connect to Database
connectDB();

// Import Routes
const conceptRoutes = require('./routes/conceptRoutes');
const searchRoutes = require('./routes/searchRoutes');
const filterRoutes = require('./routes/filterRoutes');
const paginationRoutes = require('./routes/paginationRoutes');
const sortRoutes = require('./routes/sortRoutes');
const analyticsRoutes = require('./routes/analyticsRoutes');
const discoveryRoutes = require('./routes/discoveryRoutes');
const bookmarkNotesRoutes = require('./routes/bookmarkNotesRoutes');
const bulkRoutes = require('./routes/bulkRoutes');
const authRoutes = require('./routes/authRoutes');
const adminRoutes = require('./routes/adminRoutes');
const systemRoutes = require('./routes/systemRoutes');
const middlewareRoutes = require('./routes/middlewareRoutes');
const validationRoutes = require('./routes/validationRoutes');
const headOptionsRoutes = require('./routes/headOptionsRoutes');
const { checkMaintenance } = require('./middleware/auth');

const app = express();

// Middleware
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cors());
app.use(cookieParser());

// Global Maintenance Mode Middleware
app.use(checkMaintenance);

// ============================================================
// Root Welcome Route — must be before other route mounts
// ============================================================
app.get('/', (req, res) => {
  res.status(200).json({
    success: true,
    message: '🏛️ Welcome to the CAIA System Design Backend Project!',
    project: 'CAIA System Design Knowledge Base',
    version: '1.0.0',
    description: 'A comprehensive RESTful API for managing system design concepts, interview preparation, and knowledge management.',
    endpoints: {
      concepts: '/api/v1/concepts',
      search: '/api/v1/search',
      auth: '/api/v1/auth',
      analytics: '/api/v1/analytics',
      docs: 'Visit the frontend client for full interactive documentation'
    },
    status: 'Running ✅'
  });
});

// Mount Routes
app.use('/', sortRoutes);
app.use('/', paginationRoutes);
app.use('/', bulkRoutes);
app.use('/', conceptRoutes);
app.use('/', searchRoutes);
app.use('/', filterRoutes);
app.use('/', analyticsRoutes);
app.use('/', discoveryRoutes);
app.use('/', bookmarkNotesRoutes);
app.use('/', authRoutes);
app.use('/', adminRoutes);
app.use('/', systemRoutes);
app.use('/', middlewareRoutes);
app.use('/', validationRoutes);
app.use('/', headOptionsRoutes);

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(`🚀 Server running in ${process.env.NODE_ENV} mode on port ${PORT}`);
});
