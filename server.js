// server.js - Main server file for local development
const express = require('express');
const cors = require('cors');
const path = require('path');
require('dotenv').config();

const connectDB = require('./shared/config/database');

const app = express();

// Connect to database
connectDB();

// Middleware
app.use(cors());
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true }));

// Serve static files from public directory
app.use(express.static('public'));

// API Routes
app.use('/api/recipes', require('./api/recipes'));
app.use('/api/vision', require('./api/vision'));
app.use('/api/users', require('./api/users'));
app.use('/api/favorites', require('./api/favorites'));

// Health check endpoint
app.get('/api/health', (req, res) => {
  res.json({ 
    status: 'OK', 
    message: 'Smart Recipe Generator API is running',
    timestamp: new Date().toISOString()
  });
});

// Serve frontend for all other routes
app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'index.html'));
});

// Error handling middleware
app.use((error, req, res, next) => {
  console.error('Server error:', error);
  res.status(500).json({
    success: false,
    message: 'Internal server error',
    error: process.env.NODE_ENV === 'development' ? error.message : undefined
  });
});

// 404 handler for API routes
app.use('/api/*', (req, res) => {
  res.status(404).json({
    success: false,
    message: 'API endpoint not found'
  });
});

const PORT = process.env.PORT || 6004;

app.listen(PORT, () => {
  console.log('🚀 Smart Recipe Generator Server Started!');
  console.log(`📍 Local: http://localhost:${PORT}`);
  console.log(`🔗 API: http://localhost:${PORT}/api`);
  console.log(`❤️ Health: http://localhost:${PORT}/api/health`);
  console.log('📁 Serving static files from: ./public');
  console.log('💾 Database:', process.env.MONGODB_URI ? 'Connected' : 'Not configured');
  console.log('🤖 Gemini AI:', process.env.GEMINI_API_KEY ? 'Configured' : 'Not configured');
  console.log('──────────────────────────────────────────');
});