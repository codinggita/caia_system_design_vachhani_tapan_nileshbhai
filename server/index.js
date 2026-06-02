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

const app = express();

// Middleware
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cors());
app.use(cookieParser());

// Mount Routes
app.use('/', sortRoutes);
app.use('/', paginationRoutes);
app.use('/', conceptRoutes);
app.use('/', searchRoutes);
app.use('/', filterRoutes);
app.use('/', analyticsRoutes);
app.use('/', discoveryRoutes);
app.use('/', bookmarkNotesRoutes);

// Basic Route
app.get('/', (req, res) => {
  res.send('🌌 CAIA System Design API is running...');
});

// Health Check
app.get('/api/v1/health', (req, res) => {
  res.status(200).json({ success: true, message: 'System is healthy' });
});

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(`🚀 Server running in ${process.env.NODE_ENV} mode on port ${PORT}`);
});
