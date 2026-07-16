import nodemailer from 'nodemailer';
import { config } from '../config/config';
import {
  otpTemplate,
  registrationSuccessTemplate,
  complaintSubmittedTemplate,
  complaintAssignedTemplate,
  complaintUpdatedTemplate,
  complaintResolvedTemplate,
  complaintClosedTemplate,
  passwordResetTemplate,
  welcomeTemplate,
} from '../utils/emailTemplates';

const createTransporter = () => {
  return nodemailer.createTransport({
    host: config.smtp.host,
    port: config.smtp.port,
    secure: config.smtp.port === 465,
    auth: {
      user: config.smtp.user,
      pass: config.smtp.pass,
    },
  });
};

export const sendEmail = async (to: string, subject: string, html: string): Promise<boolean> => {
  try {
    if (!config.smtp.user || !config.smtp.pass) {
      console.log(`[Email] SMTP not configured. Would send to: ${to}, Subject: ${subject}`);
      return true;
    }
    const transporter = createTransporter();
    await transporter.sendMail({
      from: config.smtpFrom,
      to,
      subject,
      html,
    });
    console.log(`[Email] Sent to ${to}: ${subject}`);
    return true;
  } catch (error) {
    console.error('[Email] Send error:', error);
    return false;
  }
};

export const sendOTPEmail = async (email: string, otp: string): Promise<boolean> => {
  return sendEmail(email, 'Verify Your Email - College Complaint System', otpTemplate(otp));
};

export const sendRegistrationSuccessEmail = async (email: string, name: string): Promise<boolean> => {
  return sendEmail(email, 'Registration Successful - College Complaint System', registrationSuccessTemplate(name));
};

export const sendComplaintSubmittedEmail = async (
  email: string, name: string, complaintId: string, title: string
): Promise<boolean> => {
  return sendEmail(email, `Complaint Submitted - ${complaintId}`, complaintSubmittedTemplate(name, complaintId, title));
};

export const sendComplaintAssignedEmail = async (
  email: string, name: string, complaintId: string, staffName: string
): Promise<boolean> => {
  return sendEmail(email, `Complaint Assigned - ${complaintId}`, complaintAssignedTemplate(name, complaintId, staffName));
};

export const sendComplaintUpdatedEmail = async (
  email: string, name: string, complaintId: string, status: string, message: string
): Promise<boolean> => {
  return sendEmail(email, `Complaint Updated - ${complaintId}`, complaintUpdatedTemplate(name, complaintId, status, message));
};

export const sendComplaintResolvedEmail = async (
  email: string, name: string, complaintId: string, resolutionNotes: string, adminRemarks: string
): Promise<boolean> => {
  return sendEmail(email, `Complaint Resolved - ${complaintId}`, complaintResolvedTemplate(name, complaintId, resolutionNotes, adminRemarks));
};

export const sendComplaintClosedEmail = async (
  email: string, name: string, complaintId: string
): Promise<boolean> => {
  return sendEmail(email, `Complaint Closed - ${complaintId}`, complaintClosedTemplate(name, complaintId));
};

export const sendPasswordResetEmail = async (email: string, name: string, otp: string): Promise<boolean> => {
  return sendEmail(email, 'Password Reset - College Complaint System', passwordResetTemplate(name, otp));
};

export const sendWelcomeEmail = async (email: string, name: string): Promise<boolean> => {
  return sendEmail(email, 'Welcome - College Complaint System', welcomeTemplate(name));
};
