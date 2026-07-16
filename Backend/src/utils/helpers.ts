import { v4 as uuidv4 } from 'uuid';

export const generateComplaintId = (): string => {
  const prefix = 'CMP';
  const timestamp = Date.now().toString(36).toUpperCase();
  const random = uuidv4().split('-')[0].toUpperCase().slice(0, 4);
  return `${prefix}-${timestamp}-${random}`;
};

export const calculatePagination = (page: number, limit: number, total: number) => {
  const totalPages = Math.ceil(total / limit);
  const skip = (page - 1) * limit;
  return { skip, totalPages, total };
};
