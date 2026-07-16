import mongoose, { Schema, Document } from 'mongoose';
import { INotification } from '../types';

const notificationSchema = new Schema<INotification & Document>(
  {
    studentId: { type: Schema.Types.ObjectId, ref: 'Student', required: true },
    title: { type: String, required: true },
    message: { type: String, required: true },
    read: { type: Boolean, default: false },
  },
  { timestamps: true }
);

notificationSchema.index({ studentId: 1, createdAt: -1 });

export default mongoose.model<INotification & Document>('Notification', notificationSchema);
