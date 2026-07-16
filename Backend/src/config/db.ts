import mongoose from 'mongoose';
import { config } from './config';

const connectDB = async (): Promise<void> => {
  try {
    const conn = await mongoose.connect(config.mongodbUri);
    console.log(`MongoDB Connected: ${conn.connection.host}/${conn.connection.name}`);
  } catch (error: any) {
    console.error('\n--- MongoDB Connection Failed ---');
    if (error.message?.includes('querySrv ECONNREFUSED')) {
      console.error('Cause: DNS SRV resolution failed for Atlas cluster.');
      console.error('Fixes:');
      console.error('  1. Ensure your Atlas cluster is running (not paused)');
      console.error('  2. Whitelist your IP in Atlas → Network Access');
      console.error('  3. Verify database user credentials in Atlas → Database Access');
      console.error('  4. Check your internet connection allows DNS SRV queries');
    } else if (error.message?.includes('ECONNREFUSED')) {
      console.error('Cause: Could not reach MongoDB server.');
      console.error('Fix: Ensure MongoDB is running locally on port 27017');
    } else if (error.message?.includes('bad auth')) {
      console.error('Cause: Authentication failed.');
      console.error('Fix: Check your MongoDB username and password in .env');
    } else {
      console.error(`Error: ${error.message}`);
    }
    console.error('--------------------------------\n');
    process.exit(1);
  }
};

export default connectDB;
