import mongoose from 'mongoose';
import { logger } from '../utils/logger';
import 'dotenv/config';

export const connectDBs = async () => {
  try {
    if (process.env.MONGODB_URI) {
      await mongoose.connect(process.env.MONGODB_URI);
      logger.info('MongoDB connected');
    } else {
      logger.warn('MONGODB_URI not found. Skipping MongoDB connection.');
    }
  } catch (error) {
    logger.error('Database connection failed', error);
  }
};
