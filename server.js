import express from 'express';
import './routes/cassoWebhook.js'; // ensure router is imported

// The route file attaches itself to app, so we need shared app.
// We'll create the app here and export it.
import { app } from './routes/cassoWebhook.js';

// Health check endpoint for Railway
app.get('/health', (req, res) => {
  res.status(200).json({ 
    status: 'OK', 
    timestamp: new Date().toISOString(),
    uptime: process.uptime(),
    service: 'Payment Bot'
  });
});

// Root endpoint
app.get('/', (req, res) => {
  res.json({ 
    message: 'Payment Bot is running!',
    endpoints: {
      health: '/health',
      webhook: '/webhook/casso'
    }
  });
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`🚀 Webhook listening on :${PORT}`));