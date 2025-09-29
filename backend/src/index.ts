import express from 'express';
import { connectDB } from './database/connection';
import { corsMiddleware } from './middleware/cors';
import { errorHandler } from './middleware/errorHandler';
import courtRoutes from './routes/courtRoutes';
import reviewRoutes from './routes/reviewRoutes';
import { config } from '../config';

const app = express();

// Connect to database
connectDB();

// Middleware
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true }));
app.use(corsMiddleware);

// Routes
app.use('/api/courts', courtRoutes);
app.use('/api/courts', reviewRoutes);

// Health check endpoint
app.get('/api/health', (req, res) => {
  res.status(200).json({
    success: true,
    message: 'Tennis Courts API is running',
    timestamp: new Date().toISOString()
  });
});

// 404 handler (Express 5: avoid '*' path, use fallback middleware)
app.use((req, res) => {
  res.status(404).json({
    success: false,
    message: `Route ${req.originalUrl} not found`
  });
});

// Error handling middleware
app.use(errorHandler);

const PORT = config.port;

app.listen(PORT, () => {
  console.log(`Server running in ${config.nodeEnv} mode on port ${PORT}`);
});

export default app;
