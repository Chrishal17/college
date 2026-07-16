import mongoose, { Schema, Document } from 'mongoose';
import { IStudent, CollegeType } from '../types';

const studentSchema = new Schema<IStudent & Document>(
  {
    name: { type: String, required: true, trim: true },
    email: { type: String, required: true, unique: true, lowercase: true, trim: true },
    password: { type: String, required: true, select: false },
    rollNumber: { type: String, required: true, unique: true, trim: true },
    registerNumber: { type: String, required: true, unique: true, trim: true },
    collegeType: { type: String, enum: Object.values(CollegeType), required: true },
    department: { type: String, required: true, trim: true },
    year: { type: Number, required: true, min: 1, max: 5 },
    section: { type: String, required: true, trim: true },
    phone: { type: String, required: true, trim: true },
    verified: { type: Boolean, default: false },
    profilePicture: { type: String, default: '' },
    isActive: { type: Boolean, default: true },
  },
  { timestamps: true }
);

studentSchema.index({ email: 1 });
studentSchema.index({ rollNumber: 1 });
studentSchema.index({ department: 1 });

export default mongoose.model<IStudent & Document>('Student', studentSchema);
