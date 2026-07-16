import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import morgan from 'morgan';
import rateLimit from 'express-rate-limit';
import path from 'path';
import { config } from './config/config';
import connectDB from './config/db';
import { seedAdmin } from './config/admin';
import routes from './routes';
import { errorHandler, notFound } from './middlewares/error.middleware';

const app = express();

// Security
app.use(helmet());
app.use(cors({ origin: config.clientUrl, credentials: true }));
app.use(rateLimit({ windowMs: config.rateLimitWindowMs, max: config.rateLimitMaxRequests, message: { success: false, message: 'Too many requests. Try again later.' } }));

// Body parsing
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true, limit: '10mb' }));

// Logging
if (config.nodeEnv === 'development') app.use(morgan('dev'));

// Static files
app.use('/uploads', express.static(path.join(__dirname, '..', 'uploads')));

// Health check
app.get('/api/health', (_req, res) => { res.json({ success: true, message: 'Server is running', timestamp: new Date().toISOString() }); });

// Routes
app.use(routes);

// 404
app.use(notFound);

// Error handler
app.use(errorHandler);

const startServer = async (): Promise<void> => {
  try {
    await connectDB();
    await seedAdmin();
    app.listen(config.port, () => {
      console.log(`Server running in ${config.nodeEnv} mode on port ${config.port}`);
    });
  } catch (error) {
    console.error('Failed to start server:', error);
    process.exit(1);
  }
};

startServer();

export default app;
