import React from 'react';
import { Link } from 'react-router-dom';
import { ShieldOff, ArrowLeft } from 'lucide-react';
import { Button } from '../../components/ui/Button';

const Unauthorized: React.FC = () => {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 dark:bg-gray-900 p-4">
      <div className="text-center">
        <div className="inline-flex items-center justify-center w-20 h-20 rounded-full bg-red-100 dark:bg-red-900/30 mb-6">
          <ShieldOff size={40} className="text-red-600 dark:text-red-400" />
        </div>
        <h1 className="text-6xl font-bold text-gray-900 dark:text-white mb-4">403</h1>
        <h2 className="text-xl font-semibold text-gray-700 dark:text-gray-300 mb-2">Access Denied</h2>
        <p className="text-gray-500 dark:text-gray-400 mb-8 max-w-md">You don't have permission to access this page.</p>
        <Link to="/dashboard">
          <Button><ArrowLeft size={18} /> Go Back</Button>
        </Link>
      </div>
    </div>
  );
};

export default Unauthorized;
