import { Request } from 'express';
import mongoose from 'mongoose';

export enum UserRole {
  STUDENT = 'student',
  ADMIN = 'admin',
}

export enum ComplaintStatus {
  PENDING = 'Pending',
  ASSIGNED = 'Assigned',
  IN_PROGRESS = 'In Progress',
  WAITING_FOR_STUDENT = 'Waiting for Student',
  RESOLVED = 'Resolved',
  CLOSED = 'Closed',
  REJECTED = 'Rejected',
  REOPENED = 'Reopened',
}

export enum ComplaintPriority {
  LOW = 'Low',
  MEDIUM = 'Medium',
  HIGH = 'High',
  CRITICAL = 'Critical',
}

export enum ComplaintCategory {
  CLEANLINESS = 'Cleanliness',
  ELECTRICITY = 'Electricity',
  WATER_LEAKAGE = 'Water Leakage',
  FURNITURE_DAMAGE = 'Furniture Damage',
  WIFI_INTERNET = 'WiFi Internet',
  LABORATORY_EQUIPMENT = 'Laboratory Equipment',
  CLASSROOM_MAINTENANCE = 'Classroom Maintenance',
  PROJECTOR_ISSUES = 'Projector Issues',
  WASHROOM_MAINTENANCE = 'Washroom Maintenance',
  GARBAGE = 'Garbage',
  SECURITY = 'Security',
  MEDICAL_EMERGENCY = 'Medical Emergency',
  HOSTEL = 'Hostel',
  LIBRARY = 'Library',
  SPORTS = 'Sports',
  TRANSPORT = 'Transport',
  PARKING = 'Parking',
  FOOD_QUALITY_CANTEEN = 'Food Quality Canteen',
  HARASSMENT = 'Harassment',
  RAGGING = 'Ragging',
  NOISE = 'Noise',
  INFRASTRUCTURE = 'Infrastructure',
  SUGGESTIONS = 'Suggestions',
  OTHER = 'Other',
}

export enum CollegeType {
  ENGINEERING = 'Engineering',
  TECHNOLOGY = 'Technology',
}

export interface IStudent {
  _id: mongoose.Types.ObjectId;
  name: string;
  email: string;
  password: string;
  rollNumber: string;
  registerNumber: string;
  collegeType: CollegeType;
  department: string;
  year: number;
  section: string;
  phone: string;
  verified: boolean;
  profilePicture: string;
  isActive: boolean;
  createdAt: Date;
  updatedAt: Date;
}

export interface IAdmin {
  _id: mongoose.Types.ObjectId;
  email: string;
  password: string;
  name: string;
  role: string;
  createdAt: Date;
  updatedAt: Date;
}

export interface ITimelineEntry {
  status: ComplaintStatus;
  message: string;
  updatedBy: mongoose.Types.ObjectId | string;
  updatedAt: Date;
}

export interface IComplaint {
  _id: mongoose.Types.ObjectId;
  complaintId: string;
  studentId: mongoose.Types.ObjectId;
  title: string;
  description: string;
  category: ComplaintCategory;
  priority: ComplaintPriority;
  location: {
    building: string;
    floor: string;
    roomNumber: string;
  };
  images: string[];
  isAnonymous: boolean;
  status: ComplaintStatus;
  timeline: ITimelineEntry[];
  adminRemarks: string;
  resolutionNotes: string;
  assignedStaff: string;
  estimatedCompletion: Date | null;
  actualCompletion: Date | null;
  resolvedAt: Date | null;
  createdAt: Date;
  updatedAt: Date;
}

export interface INotification {
  _id: mongoose.Types.ObjectId;
  studentId: mongoose.Types.ObjectId;
  title: string;
  message: string;
  read: boolean;
  createdAt: Date;
}

export interface IOTP {
  _id: mongoose.Types.ObjectId;
  email: string;
  otp: string;
  expiresAt: Date;
  verified: boolean;
  createdAt: Date;
}

export interface AuthRequest extends Request {
  user?: {
    id: string;
    email: string;
    role: UserRole;
  };
}

export interface ApiResponse<T = unknown> {
  success: boolean;
  message: string;
  data?: T;
  error?: string;
  pagination?: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
  };
}
