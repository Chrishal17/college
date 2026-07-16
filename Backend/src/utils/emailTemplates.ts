const baseTemplate = (title: string, content: string): string => `
<!DOCTYPE html>
<html>
<head><meta charset="UTF-8"><meta name="viewport" content="width=device-width,initial-scale=1.0"></head>
<body style="margin:0;padding:0;font-family:'Segoe UI',Tahoma,Geneva,Verdana,sans-serif;background-color:#f3f4f6;">
  <div style="max-width:600px;margin:0 auto;background-color:#ffffff;border-radius:12px;overflow:hidden;margin-top:20px;margin-bottom:20px;box-shadow:0 4px 6px rgba(0,0,0,0.1);">
    <div style="background:linear-gradient(135deg,#4f46e5,#7c3aed);padding:30px;text-align:center;">
      <h1 style="color:#ffffff;margin:0;font-size:24px;">College Complaint System</h1>
    </div>
    <div style="padding:30px;">
      <h2 style="color:#1f2937;margin-top:0;">${title}</h2>
      ${content}
    </div>
    <div style="background-color:#f9fafb;padding:20px;text-align:center;border-top:1px solid #e5e7eb;">
      <p style="color:#6b7280;font-size:12px;margin:0;">College Complaint Management System</p>
      <p style="color:#9ca3af;font-size:11px;margin:5px 0 0 0;">This is an automated email. Please do not reply.</p>
    </div>
  </div>
</body>
</html>`;

export const otpTemplate = (otp: string): string =>
  baseTemplate('Email Verification', `
    <p style="color:#4b5563;line-height:1.6;">Your One-Time Password (OTP) for email verification is:</p>
    <div style="text-align:center;margin:30px 0;">
      <div style="display:inline-block;background:#f3f4f6;border-radius:8px;padding:15px 30px;">
        <span style="font-size:36px;font-weight:bold;color:#4f46e5;letter-spacing:8px;">${otp}</span>
      </div>
    </div>
    <p style="color:#4b5563;line-height:1.6;">This OTP will expire in 5 minutes. If you did not request this, please ignore this email.</p>
  `);

export const registrationSuccessTemplate = (name: string): string =>
  baseTemplate('Registration Successful', `
    <p style="color:#4b5563;line-height:1.6;">Dear <strong>${name}</strong>,</p>
    <p style="color:#4b5563;line-height:1.6;">Your registration has been completed successfully. Your account is now active and you can log in.</p>
    <div style="text-align:center;margin:30px 0;">
      <a href="#" style="background:#4f46e5;color:#ffffff;padding:12px 30px;border-radius:8px;text-decoration:none;font-weight:600;">Login Now</a>
    </div>
    <p style="color:#4b5563;line-height:1.6;">Welcome to the College Complaint Management System!</p>
  `);

export const complaintSubmittedTemplate = (name: string, complaintId: string, title: string): string =>
  baseTemplate('Complaint Submitted Successfully', `
    <p style="color:#4b5563;line-height:1.6;">Dear <strong>${name}</strong>,</p>
    <p style="color:#4b5563;line-height:1.6;">Your complaint has been submitted successfully.</p>
    <div style="background:#f9fafb;border-radius:8px;padding:20px;margin:20px 0;border-left:4px solid #4f46e5;">
      <p style="margin:5px 0;color:#1f2937;"><strong>Complaint ID:</strong> ${complaintId}</p>
      <p style="margin:5px 0;color:#1f2937;"><strong>Title:</strong> ${title}</p>
      <p style="margin:5px 0;color:#1f2937;"><strong>Status:</strong> <span style="color:#f59e0b;">Pending</span></p>
    </div>
    <p style="color:#4b5563;line-height:1.6;">We will review your complaint and respond within 48 hours. You can track the status from your dashboard.</p>
  `);

export const complaintAssignedTemplate = (name: string, complaintId: string, staffName: string): string =>
  baseTemplate('Complaint Assigned', `
    <p style="color:#4b5563;line-height:1.6;">Dear <strong>${name}</strong>,</p>
    <p style="color:#4b5563;line-height:1.6;">Your complaint <strong>${complaintId}</strong> has been assigned to <strong>${staffName}</strong>.</p>
    <div style="background:#f9fafb;border-radius:8px;padding:20px;margin:20px 0;border-left:4px solid #3b82f6;">
      <p style="margin:5px 0;color:#1f2937;"><strong>Complaint ID:</strong> ${complaintId}</p>
      <p style="margin:5px 0;color:#1f2937;"><strong>Assigned To:</strong> ${staffName}</p>
      <p style="margin:5px 0;color:#1f2937;"><strong>Status:</strong> <span style="color:#3b82f6;">Assigned</span></p>
    </div>
    <p style="color:#4b5563;line-height:1.6;">Our team is working on your complaint. You will be notified when the status changes.</p>
  `);

export const complaintUpdatedTemplate = (name: string, complaintId: string, status: string, message: string): string =>
  baseTemplate('Complaint Status Updated', `
    <p style="color:#4b5563;line-height:1.6;">Dear <strong>${name}</strong>,</p>
    <p style="color:#4b5563;line-height:1.6;">Your complaint <strong>${complaintId}</strong> status has been updated.</p>
    <div style="background:#f9fafb;border-radius:8px;padding:20px;margin:20px 0;border-left:4px solid #8b5cf6;">
      <p style="margin:5px 0;color:#1f2937;"><strong>Complaint ID:</strong> ${complaintId}</p>
      <p style="margin:5px 0;color:#1f2937;"><strong>New Status:</strong> ${status}</p>
      ${message ? `<p style="margin:5px 0;color:#1f2937;"><strong>Message:</strong> ${message}</p>` : ''}
    </div>
    <p style="color:#4b5563;line-height:1.6;">Log in to your dashboard for more details.</p>
  `);

export const complaintResolvedTemplate = (name: string, complaintId: string, resolutionNotes: string, adminRemarks: string): string =>
  baseTemplate('Complaint Resolved', `
    <p style="color:#4b5563;line-height:1.6;">Dear <strong>${name}</strong>,</p>
    <p style="color:#4b5563;line-height:1.6;">Great news! Your complaint <strong>${complaintId}</strong> has been resolved.</p>
    <div style="background:#f0fdf4;border-radius:8px;padding:20px;margin:20px 0;border-left:4px solid #22c55e;">
      <p style="margin:5px 0;color:#1f2937;"><strong>Complaint ID:</strong> ${complaintId}</p>
      <p style="margin:5px 0;color:#1f2937;"><strong>Status:</strong> <span style="color:#22c55e;">Resolved</span></p>
      ${resolutionNotes ? `<p style="margin:5px 0;color:#1f2937;"><strong>Resolution:</strong> ${resolutionNotes}</p>` : ''}
      ${adminRemarks ? `<p style="margin:5px 0;color:#1f2937;"><strong>Remarks:</strong> ${adminRemarks}</p>` : ''}
    </div>
    <p style="color:#4b5563;line-height:1.6;">Please verify the resolution and accept it from your dashboard. If you are not satisfied, you can reopen the complaint.</p>
  `);

export const complaintClosedTemplate = (name: string, complaintId: string): string =>
  baseTemplate('Complaint Closed', `
    <p style="color:#4b5563;line-height:1.6;">Dear <strong>${name}</strong>,</p>
    <p style="color:#4b5563;line-height:1.6;">Your complaint <strong>${complaintId}</strong> has been closed.</p>
    <div style="background:#f9fafb;border-radius:8px;padding:20px;margin:20px 0;border-left:4px solid #6b7280;">
      <p style="margin:5px 0;color:#1f2937;"><strong>Complaint ID:</strong> ${complaintId}</p>
      <p style="margin:5px 0;color:#1f2937;"><strong>Status:</strong> Closed</p>
    </div>
    <p style="color:#4b5563;line-height:1.6;">If you have any further concerns, please submit a new complaint.</p>
  `);

export const passwordResetTemplate = (name: string, otp: string): string =>
  baseTemplate('Password Reset Request', `
    <p style="color:#4b5563;line-height:1.6;">Dear <strong>${name}</strong>,</p>
    <p style="color:#4b5563;line-height:1.6;">We received a request to reset your password. Use the OTP below:</p>
    <div style="text-align:center;margin:30px 0;">
      <div style="display:inline-block;background:#fef2f2;border:2px solid #ef4444;border-radius:8px;padding:15px 30px;">
        <span style="font-size:36px;font-weight:bold;color:#ef4444;letter-spacing:8px;">${otp}</span>
      </div>
    </div>
    <p style="color:#4b5563;line-height:1.6;">This OTP will expire in 5 minutes. If you did not request this, please secure your account.</p>
  `);

export const welcomeTemplate = (name: string): string =>
  baseTemplate('Welcome!', `
    <p style="color:#4b5563;line-height:1.6;">Dear <strong>${name}</strong>,</p>
    <p style="color:#4b5563;line-height:1.6;">Welcome to the College Complaint Management System!</p>
    <p style="color:#4b5563;line-height:1.6;">You can now:</p>
    <ul style="color:#4b5563;line-height:2;">
      <li>Submit complaints easily</li>
      <li>Track complaint status in real-time</li>
      <li>Receive instant notifications</li>
      <li>View complaint history</li>
    </ul>
    <div style="text-align:center;margin:30px 0;">
      <a href="#" style="background:#4f46e5;color:#ffffff;padding:12px 30px;border-radius:8px;text-decoration:none;font-weight:600;">Go to Dashboard</a>
    </div>
  `);
