require('dotenv').config();
const express = require('express');
const cors = require('cors');
const { errorHandler } = require('./utils/errorHandler');

// Import routes
const authRoutes = require('./routes/authRoutes');
const itineraryRoutes = require('./routes/itineraryRoutes');
const safetyRoutes = require('./routes/safetyRoutes');
const recommendationRoutes = require('./routes/recommendationRoutes');
const databaseRoutes = require('./routes/database');
const agenticRoutes = require('./routes/agentic');

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
const rawFrontendUrl = process.env.FRONTEND_URL || '';
const cleanFrontendUrl = rawFrontendUrl.replace(/\/$/, '');

const allowedOrigins = [
  'http://localhost:5173',
  'http://localhost:3000',
  rawFrontendUrl,
  cleanFrontendUrl
].filter(Boolean);

app.use(cors({
  origin: (origin, callback) => {
    // Allow requests with no origin (like mobile apps, curl, postman) or Vercel apps
    if (!origin || allowedOrigins.includes(origin) || origin.endsWith('.vercel.app')) {
      return callback(null, true);
    }
    return callback(null, true); // Allow all origins for hackathon demo compatibility
  },
  credentials: true
}));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Request logging middleware
app.use((req, res, next) => {
  console.log(`[${new Date().toISOString()}] ${req.method} ${req.path}`);
  next();
});

// Root endpoint
app.get('/', (req, res) => {
  res.status(200).json({
    success: true,
    message: 'Welcome to Smart Tour AI Backend API',
    endpoints: {
      health: '/health',
      auth: '/api/auth',
      itinerary: '/api/itinerary',
      safety: '/api/safety',
      recommendations: '/api/recommendations',
      database: '/api/database'
    }
  });
});

// Health check endpoint
app.get('/health', (req, res) => {
  res.status(200).json({
    status: 'ok',
    message: 'Smart Tour AI Backend is running',
    timestamp: new Date().toISOString()
  });
});

// API Routes
app.use('/api/auth', authRoutes);
app.use('/api/itinerary', itineraryRoutes);
app.use('/api/safety', safetyRoutes);
app.use('/api/recommendations', recommendationRoutes);
app.use('/api/database', databaseRoutes);
app.use('/api/agentic', agenticRoutes);

// 404 handler
app.use((req, res) => {
  res.status(404).json({
    success: false,
    message: 'Route not found'
  });
});

// Global error handler (must be last)
app.use(errorHandler);

// Start server
app.listen(PORT, () => {
  console.log('='.repeat(50));
  console.log(`🚀 Smart Tour AI Backend`);
  console.log(`📡 Server running on port ${PORT}`);
  console.log(`🌍 Environment: ${process.env.NODE_ENV || 'development'}`);
  console.log(`🔗 Health check: http://localhost:${PORT}/health`);
  console.log('='.repeat(50));
});

module.exports = app;
