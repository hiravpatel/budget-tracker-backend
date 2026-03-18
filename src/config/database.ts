import mongoose from 'mongoose';
import { logger } from '../utils/logger';
import 'dotenv/config';

let isConnected = false;

export const connectDBs = async () => {
  if (isConnected || mongoose.connection.readyState === 1) {
    return;
  }

  try {
    const mongoUri = process.env.MONGODB_URI;
    if (!mongoUri) {
      logger.warn('MONGODB_URI not found. Skipping MongoDB connection.');
      return;
    }

    const db = await mongoose.connect(mongoUri, {
      bufferCommands: true, // Allow commands to buffer
    });

    isConnected = !!db.connections[0].readyState;
    logger.info('MongoDB connected');
  } catch (error) {
    logger.error('Database connection failed', error);
    // In serverless, we don't necessarily want to process.exit(1)
    throw error;
  }
};
