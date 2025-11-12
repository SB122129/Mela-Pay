import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import mongoose from 'mongoose';
import coursesRouter from './routes/courses.js';
import paymentsRouter from './routes/payments.js';
import adminRouter from './routes/admin.js';
import melaRouter from './routes/mela.js';
import { errorHandler } from './middleware/errorHandler.js';

// Load environment variables
dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(cors({
  origin: process.env.CLIENT_URL || 'http://localhost:3000',
  credentials: true
}));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Request logging
app.use((req, res, next) => {
  console.log(`${new Date().toISOString()} - ${req.method} ${req.path}`);
  next();
});

// Database connection
mongoose.connect(process.env.MONGODB_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
})
.then(() => console.log('✅ MongoDB connected successfully'))
.catch((err) => console.error('❌ MongoDB connection error:', err));

// Routes
app.use('/api/mela', melaRouter);
app.use('/api/courses', coursesRouter);
app.use('/api/payments', paymentsRouter);
app.use('/api/admin', adminRouter);

// Health check
app.get('/health', (req, res) => {
  res.json({
    status: 'healthy',
    timestamp: new Date().toISOString(),
    service: 'Mela Chain Backend',
    version: '1.0.0'
  });
});

// Root endpoint
app.get('/', (req, res) => {
  res.json({
    message: '🎓 Welcome to Mela Chain API',
    tagline: 'Learn Smarter, Pay with Crypto',
    version: '1.0.0',
    endpoints: {
      health: '/health',
      courses: '/api/mela/courses',
      payments: '/api/mela/payments',
      admin: '/api/admin'
    }
  });
});

// Error handling middleware (must be last)
app.use(errorHandler);

// 404 handler
app.use((req, res) => {
  res.status(404).json({
    error: 'Not Found',
    message: `Route ${req.method} ${req.path} not found`,
    timestamp: new Date().toISOString()
  });
});

// Start server
app.listen(PORT, () => {
  console.log(`🚀 Mela Chain Backend running on port ${PORT}`);
  console.log(`🌍 Environment: ${process.env.NODE_ENV || 'development'}`);
  console.log(`📚 EdX API: ${process.env.EDX_API_BASE}`);
  console.log(`💰 NowPayments: ${process.env.NOWPAYMENTS_API_KEY ? 'Configured' : 'Not configured'}`);
});

export default app;
