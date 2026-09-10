# College Complaint Management System

A full-stack web application for managing college student complaints, notifications, authentication, and administrative workflows.

## Project Overview

This project is designed for a college environment where students can submit complaints, track their status, and receive notifications, while administrators can manage complaints, students, and analytics dashboard

The repository contains two main folders:

- `Backend/` — Express.js + TypeScript + MongoDB API
- `Frontend/` — React + Vite + TypeScript user interface ui

## System Modules

### Student Features

- Register and login
- Submit complaints with title, category, description, and optional attachments
- View submitted complaints and complaint status
- Track complaint updates
- Receive notifications
- Update student profile

### Admin Features

- Admin authentication and secure dashboard access
- Manage students
- Review and update all complaints
- Assign complaint statuses
- Track notifications and communication
- View analytics and dashboard summaries

### Shared Features

- JWT-based authentication
- OTP verification flow
- Email-based OTP and notification support
- File upload support for complaint evidence
- Rate limiting, CORS, Helmet, and logging support

## Tech Stack

### Backend

- Node.js
- TypeScript
- Express.js
- MongoDB with Mongoose
- JWT authentication
- Nodemailer
- Cloudinary and Multer for file handling

### Frontend

- React
- Vite
- TypeScript
- React Router
- Axios
- Recharts for analytics charts
- Tailwind CSS styling support

## Repository Structure

```text
college/
├── Backend/
│   ├── src/
│   ├── package.json
│   └── tsconfig.json
└── Frontend/
    ├── src/
    ├── package.json
    └── vite.config.ts
```

## Prerequisites

Before starting the project, make sure you have the following installed:

- Node.js 18+
- npm or yarn
- MongoDB instance running locally or remotely
- SMTP credentials for sending email/OTP

## Environment Setup

Create a `.env` file in the `Backend/` folder using variables similar to the project configuration in `Backend/src/config/config.ts`.

Example environment variables:

```env
PORT=5000
NODE_ENV=development
CLIENT_URL=http://localhost:5173
MONGODB_URI=mongodb://localhost:27017/college_complaints
JWT_SECRET=your-secret-key
JWT_EXPIRES_IN=7d
ADMIN_EMAIL=admin@college.edu
ADMIN_PASSWORD=Admin@123
SMTP_HOST=smtp.gmail.com
SMTP_PORT=587
SMTP_USER=your-email
SMTP_PASS=your-app-password
SMTP_FROM=College Complaint System <noreply@college.edu>
OTP_EXPIRE_MINUTES=5
OTP_LENGTH=6
MAX_FILE_UPLOAD_SIZE=5242880
```

## Backend Setup

Go to the backend folder:

```bash
cd Backend
npm install
npm run dev
```

The Express API starts on the configured port, usually `5000`.

## Frontend Setup

Go to the frontend folder:

```bash
cd Frontend
npm install
npm run dev
```

Vite typically runs on:

```text
http://localhost:5173
```

## Production Build

Backend:

```bash
cd Backend
npm run build
npm start
```

Frontend:

```bash
cd Frontend
npm run build
npm run preview
```

## API Base

The backend routes are organized under `/api`, including:

- `/api/auth`
- `/api/students`
- `/api/complaints`
- `/api/admin`
- `/api/notifications`

## Default Admin

The backend config includes seeded admin defaults:

```text
Email: admin@college.edu
Password: Admin@123
```

This account should be changed for production use.

## Project Goals

The goal of the project is to provide a modern complaint resolution workflow for colleges:

1. Students can raise complaints quickly.
2. Admins can manage complaints centrally.
3. Notifications keep students informed.
4. Reports and dashboard analytics improve administrative decisions.

## License

This project is for college complaint management and campus workflow use.
