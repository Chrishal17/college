export interface User {
  id: string;
  name: string;
  email: string;
  role: 'student' | 'admin';
  department?: string;
  year?: number;
  verified?: boolean;
  rollNumber?: string;
  registerNumber?: string;
  collegeType?: string;
  section?: string;
  phone?: string;
  profilePicture?: string;
  isActive?: boolean;
  createdAt?: string;
}

export interface AuthResponse {
  token: string;
  user: User;
}

export interface Student {
  _id: string;
  name: string;
  email: string;
  rollNumber: string;
  registerNumber: string;
  collegeType: string;
  department: string;
  year: number;
  section: string;
  phone: string;
  verified: boolean;
  profilePicture: string;
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface Complaint {
  _id: string;
  complaintId: string;
  studentId: Student | string;
  title: string;
  description: string;
  category: string;
  priority: string;
  location: {
    building: string;
    floor: string;
    roomNumber: string;
  };
  images: string[];
  isAnonymous: boolean;
  status: string;
  timeline: TimelineEntry[];
  adminRemarks: string;
  resolutionNotes: string;
  assignedStaff: string;
  estimatedCompletion: string | null;
  actualCompletion: string | null;
  resolvedAt: string | null;
  createdAt: string;
  updatedAt: string;
}

export interface TimelineEntry {
  status: string;
  message: string;
  updatedBy: string;
  updatedAt: string;
}

export interface Notification {
  _id: string;
  studentId: string;
  title: string;
  message: string;
  read: boolean;
  createdAt: string;
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

export interface DashboardStats {
  totalComplaints: number;
  pending: number;
  resolved: number;
  inProgress: number;
  critical: number;
  avgResolutionTime: string;
  recentComplaints: Complaint[];
  latestNotification: Notification | null;
  unreadNotificationCount: number;
}

export interface AdminDashboardStats {
  totalStudents: number;
  verifiedStudents: number;
  pendingStudents: number;
  totalComplaints: number;
  pendingComplaints: number;
  resolvedComplaints: number;
  criticalComplaints: number;
  todayComplaints: number;
  recentComplaints: Complaint[];
  recentStudents: Student[];
  charts: {
    categoryStats: { _id: string; count: number }[];
    departmentStats: { _id: string; count: number }[];
    priorityStats: { _id: string; count: number }[];
    monthlyStats: { _id: { year: number; month: number }; count: number }[];
  };
}
