import mongoose, { Schema, Document } from 'mongoose';
import { IAdmin } from '../types';

const adminSchema = new Schema<IAdmin & Document>(
  {
    email: { type: String, required: true, unique: true, lowercase: true },
    password: { type: String, required: true, select: false },
    name: { type: String, required: true },
    role: { type: String, default: 'admin' },
  },
  { timestamps: true }
);

export default mongoose.model<IAdmin & Document>('Admin', adminSchema);
