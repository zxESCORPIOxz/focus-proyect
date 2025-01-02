import React from 'react';
import { useRouteError, Link } from 'react-router-dom';

const LoadingSpinner = () => {
  
  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 flex items-center justify-center">
      <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-green-600"></div>
    </div>
  );
};

export default LoadingSpinner;


