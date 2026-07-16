import crypto from 'crypto';
import { config } from '../config/config';
import OTP from '../models/OTP.model';

export const generateOTP = (): string => {
  const length = config.otpLength;
  const digits = '0123456789';
  let otp = '';
  const bytes = crypto.randomBytes(length);
  for (let i = 0; i < length; i++) {
    otp += digits[bytes[i] % 10];
  }
  return otp;
};

export const createOTP = async (email: string): Promise<string> => {
  await OTP.deleteMany({ email, verified: false });
  const otp = generateOTP();
  const expiresAt = new Date(Date.now() + config.otpExpireMinutes * 60 * 1000);
  await OTP.create({ email, otp, expiresAt });
  return otp;
};

export const verifyOTP = async (email: string, otp: string): Promise<boolean> => {
  const record = await OTP.findOne({
    email,
    otp,
    verified: false,
    expiresAt: { $gt: new Date() },
  });
  if (!record) return false;
  record.verified = true;
  await record.save();
  return true;
};
