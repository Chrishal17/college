import bcrypt from 'bcryptjs';
import Admin from '../models/Admin.model';
import { config } from './config';

export const seedAdmin = async (): Promise<void> => {
  try {
    const existingAdmin = await Admin.findOne({ email: config.adminEmail });
    if (!existingAdmin) {
      const hashedPassword = await bcrypt.hash(config.adminPassword, 12);
      await Admin.create({
        email: config.adminEmail,
        password: hashedPassword,
        name: 'System Administrator',
        role: 'admin',
      });
      console.log('Admin account seeded successfully');
    } else {
      console.log('Admin account already exists');
    }
  } catch (error) {
    console.error('Admin seeding error:', error);
  }
};
