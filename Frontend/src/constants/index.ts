export const COMPLAINT_CATEGORIES = [
  'Cleanliness', 'Electricity', 'Water Leakage', 'Furniture Damage',
  'WiFi Internet', 'Laboratory Equipment', 'Classroom Maintenance',
  'Projector Issues', 'Washroom Maintenance', 'Garbage', 'Security',
  'Medical Emergency', 'Hostel', 'Library', 'Sports', 'Transport',
  'Parking', 'Food Quality Canteen', 'Harassment', 'Ragging',
  'Noise', 'Infrastructure', 'Suggestions', 'Other',
] as const;

export const PRIORITY_OPTIONS = ['Low', 'Medium', 'High', 'Critical'] as const;

export const STATUS_OPTIONS = [
  'Pending', 'Assigned', 'In Progress', 'Waiting for Student',
  'Resolved', 'Closed', 'Rejected', 'Reopened',
] as const;

export const COLLEGE_TYPES = ['Engineering', 'Technology'] as const;

export const DEPARTMENTS = [
  'Computer Science', 'Information Technology', 'Electronics',
  'Mechanical', 'Civil', 'Electrical', 'Chemical',
  'Biotechnology', 'Other',
] as const;

export const YEARS = [1, 2, 3, 4, 5] as const;

export const SECTIONS = ['A', 'B', 'C', 'D', 'E'] as const;

export const STATUS_COLORS: Record<string, string> = {
  'Pending': 'bg-yellow-100 text-yellow-800',
  'Assigned': 'bg-blue-100 text-blue-800',
  'In Progress': 'bg-indigo-100 text-indigo-800',
  'Waiting for Student': 'bg-orange-100 text-orange-800',
  'Resolved': 'bg-green-100 text-green-800',
  'Closed': 'bg-gray-100 text-gray-800',
  'Rejected': 'bg-red-100 text-red-800',
  'Reopened': 'bg-purple-100 text-purple-800',
};

export const PRIORITY_COLORS: Record<string, string> = {
  'Low': 'bg-sky-100 text-sky-800',
  'Medium': 'bg-yellow-100 text-yellow-800',
  'High': 'bg-orange-100 text-orange-800',
  'Critical': 'bg-red-100 text-red-800',
};
