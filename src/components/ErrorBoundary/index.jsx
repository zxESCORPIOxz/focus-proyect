import React from 'react';
import { useRouteError, Link } from 'react-router-dom';

const ErrorBoundary = () => {
  const error = useRouteError();
  
  // Safe access to error properties with type checking
  const getErrorMessage = () => {
    if (error && typeof error === 'object') {
      if ('statusText' in error) return error.statusText;
      if ('message' in error) return error.message;
    }
    return "Ha ocurrido un error inesperado";
  };

  const getErrorStatus = () => {
    if (error && typeof error === 'object' && 'status' in error) {
      return error.status;
    }
    return "Desconocido";
  };

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 flex items-center justify-center px-4">
      <div className="max-w-md w-full text-center space-y-6">
        <div className="space-y-2">
          <h1 className="text-4xl font-bold text-red-600">
            ¡Oops! Algo salió mal
          </h1>
          <p className="text-gray-600 dark:text-gray-400">
            Error: {String(getErrorStatus())}
          </p>
        </div>

        <div className="space-y-4">
          <p className="text-sm text-gray-500 dark:text-gray-400">
            Error: {String(getErrorStatus())}
          </p>

          <Link
            to="/"
            className="inline-block px-6 py-3 bg-green-600 hover:bg-green-700 text-white font-medium rounded-lg transition-colors"
          >
            Volver al inicio
          </Link>
        </div>
      </div>
    </div>
  );
};

export default ErrorBoundary;