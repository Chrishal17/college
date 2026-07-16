import jwt from 'jsonwebtoken';
import { config } from '../config/config';
import { UserRole } from '../types';

export const generateToken = (id: string, email: string, role: UserRole): string => {
  return jwt.sign({ id, email, role }, config.jwtSecret, {
    expiresIn: config.jwtExpiresIn as string & { __brand: 'StringValue' },
  } as jwt.SignOptions);
};

export const verifyToken = (token: string): jwt.JwtPayload | string => {
  return jwt.verify(token, config.jwtSecret);
};
