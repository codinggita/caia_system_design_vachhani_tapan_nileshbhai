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
const { checkMaintenance } = require('./middleware/auth');

const app = express();

// Middleware
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cors());
app.use(cookieParser());

// Global Maintenance Mode Middleware
app.use(checkMaintenance);

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

// Basic Route
app.get('/', (req, res) => {
  res.send('🌌 CAIA System Design API is running...');
});

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(`🚀 Server running in ${process.env.NODE_ENV} mode on port ${PORT}`);
});
