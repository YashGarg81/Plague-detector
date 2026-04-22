import mongoose from 'mongoose';
import config from './environment';

export const connectDatabase = async (): Promise<void> => {
  try {
    await mongoose.connect(config.mongodbUri);
    console.log('✅ MongoDB connected successfully');
  } catch (error) {
    console.error('❌ MongoDB connection error:', error);
    process.exit(1);
  }
};

export const disconnectDatabase = async (): Promise<void> => {
  try {
    await mongoose.disconnect();
    console.log('✅ MongoDB disconnected');
  } catch (error) {
    console.error('❌ MongoDB disconnection error:', error);
  }
};

export default { connectDatabase, disconnectDatabase };
