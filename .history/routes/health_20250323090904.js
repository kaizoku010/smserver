import express from 'express';
import mongoose from 'mongoose';

const router = express.Router();

router.get('/db', (_, res) => {
    try {
        const isConnected = mongoose.connection.readyState === 1;
        const details = {
            state: mongoose.connection.readyState,
            host: mongoose.connection.host,
            name: mongoose.connection.name
        };
        
        res.json({ 
            status: isConnected ? 'connected' : 'disconnected',
            details
        });
    } catch (error) {
        console.error('Error checking database connection:', error);
        res.status(500).json({ 
            status: 'error', 
            error: error instanceof Error ? error.message : 'Unknown error',
            details: {
                state: 0,
                host: 'unknown',
                name: 'unknown'
            }
        });
    }
});

export default router;
