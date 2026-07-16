import React from 'react';
import { Link } from 'react-router-dom';
import { ServerCrash, ArrowLeft } from 'lucide-react';
import { Button } from '../../components/ui/Button';

const ServerError: React.FC = () => {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 dark:bg-gray-900 p-4">
      <div className="text-center">
        <div className="inline-flex items-center justify-center w-20 h-20 rounded-full bg-orange-100 dark:bg-orange-900/30 mb-6">
          <ServerCrash size={40} className="text-orange-600 dark:text-orange-400" />
        </div>
        <h1 className="text-6xl font-bold text-gray-900 dark:text-white mb-4">500</h1>
        <h2 className="text-xl font-semibold text-gray-700 dark:text-gray-300 mb-2">Server Error</h2>
        <p className="text-gray-500 dark:text-gray-400 mb-8 max-w-md">Something went wrong on our end. Please try again later.</p>
        <Link to="/dashboard">
          <Button><ArrowLeft size={18} /> Go to Dashboard</Button>
        </Link>
      </div>
    </div>
  );
};

export default ServerError;
