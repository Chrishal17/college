import React from 'react';
import type { ReactNode } from 'react';
import { Shield } from 'lucide-react';

const AuthLayout: React.FC<{ children: ReactNode }> = ({ children }) => {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-indigo-50 via-white to-purple-50 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900 p-4">
      <div className="w-full max-w-md">
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-indigo-600 text-white mb-4 shadow-lg shadow-indigo-200 dark:shadow-indigo-900/50">
            <Shield size={32} />
          </div>
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white">College Complaint System</h1>
          <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">Manage complaints efficiently</p>
        </div>
        <div className="rounded-2xl border border-gray-200 bg-white/80 p-8 shadow-xl backdrop-blur-sm dark:border-gray-700 dark:bg-gray-800/80">
          {children}
        </div>
      </div>
    </div>
  );
};

export default AuthLayout;
