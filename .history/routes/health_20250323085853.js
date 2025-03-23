import express from 'express';
import mongoose from 'mongoose';

const router = express.Router();

router.get('/db', (_, res) => {
  try {
    const isConnected = mongoose.connection.readyState === 1;
    console.log('Current MongoDB connection state:', {
      readyState: mongoose.connection.readyState,
      host: mongoose.connection.host,
      name: mongoose.connection.name
    });
    
    res.json({ 
      status: isConnected ? 'connected' : 'disconnected',
      details: {
        state: mongoose.connection.readyState,
        host: mongoose.connection.host,
        name: mongoose.connection.name
      }
    });
  } catch (error) {
    console.error('Error checking database connection:', error);
    res.status(500).json({ 
      status: 'disconnected', 
      error: error instanceof Error ? error.message : 'Unknown error' 
    });
  }
});

// Add server health check endpoint
router.get('/', (_, res) => {
  res.json({
    status: 'healthy',
    timestamp: new Date().toISOString(),
    uptime: process.uptime()
  });
});

export default router;