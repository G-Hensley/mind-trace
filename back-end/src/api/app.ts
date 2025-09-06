import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import morgan from 'morgan';
import { errorHandler } from '../middleware/error';
import { config } from '@/config/env';
import { healthRoutes } from '@/api/routes/health';

export const createApp = () => {
  const app = express();

  // Middleware setup
  app.use(helmet());
  app.use(
    cors({
      origin: config.FRONTEND_URL,
      credentials: true,
    })
  );
  app.use(morgan('combined'));
  app.use(express.json({ limit: '10mb' }));
  app.use(express.urlencoded({ extended: true }));

  // Routes will be added here in the future
  app.use('/health', healthRoutes);

  // Error handling middleware will be added here in the future
  app.use(errorHandler);

  return app;
};
