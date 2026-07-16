import mongoose, { Schema, Document } from 'mongoose';
import { IOTP } from '../types';

const otpSchema = new Schema<IOTP & Document>(
  {
    email: { type: String, required: true, lowercase: true },
    otp: { type: String, required: true },
    expiresAt: { type: Date, required: true },
    verified: { type: Boolean, default: false },
  },
  { timestamps: true }
);

otpSchema.index({ email: 1, expiresAt: 1 });

export default mongoose.model<IOTP & Document>('OTP', otpSchema);
