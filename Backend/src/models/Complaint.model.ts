import mongoose, { Schema, Document } from 'mongoose';
import { IComplaint, ComplaintStatus, ComplaintPriority, ComplaintCategory } from '../types';

const complaintSchema = new Schema<IComplaint & Document>(
  {
    complaintId: { type: String, required: true, unique: true },
    studentId: { type: Schema.Types.ObjectId, ref: 'Student', required: true },
    title: { type: String, required: true, trim: true },
    description: { type: String, required: true },
    category: { type: String, enum: Object.values(ComplaintCategory), required: true },
    priority: { type: String, enum: Object.values(ComplaintPriority), default: ComplaintPriority.MEDIUM },
    location: {
      building: { type: String, default: '' },
      floor: { type: String, default: '' },
      roomNumber: { type: String, default: '' },
    },
    images: [{ type: String }],
    isAnonymous: { type: Boolean, default: false },
    status: { type: String, enum: Object.values(ComplaintStatus), default: ComplaintStatus.PENDING },
    timeline: [
      {
        status: { type: String, enum: Object.values(ComplaintStatus) },
        message: { type: String },
        updatedBy: { type: Schema.Types.Mixed },
        updatedAt: { type: Date, default: Date.now },
      },
    ],
    adminRemarks: { type: String, default: '' },
    resolutionNotes: { type: String, default: '' },
    assignedStaff: { type: String, default: '' },
    estimatedCompletion: { type: Date, default: null },
    actualCompletion: { type: Date, default: null },
    resolvedAt: { type: Date, default: null },
  },
  { timestamps: true }
);

complaintSchema.index({ complaintId: 1 });
complaintSchema.index({ studentId: 1 });
complaintSchema.index({ status: 1 });
complaintSchema.index({ category: 1 });
complaintSchema.index({ priority: 1 });
complaintSchema.index({ createdAt: -1 });

export default mongoose.model<IComplaint & Document>('Complaint', complaintSchema);
