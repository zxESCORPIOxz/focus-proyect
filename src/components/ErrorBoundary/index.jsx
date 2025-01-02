import React, { Component } from 'react';
import { Link } from 'react-router-dom';

class ErrorBoundary extends Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false, error: null, errorInfo: null };
  }

  static getDerivedStateFromError(error) {
    // Actualiza el estado para mostrar la UI de respaldo en caso de error
    return { hasError: true, error };
  }

  componentDidCatch(error, errorInfo) {
    // Puedes loguear el error en un servicio de seguimiento de errores
    this.setState({ errorInfo });
  }

  render() {
    if (this.state.hasError) {
      return (
        <div className="min-h-screen bg-gray-50 dark:bg-gray-900 flex items-center justify-center px-4">
          <div className="max-w-md w-full text-center space-y-6">
            <div className="space-y-2">
              <h1 className="text-4xl font-bold text-red-600">
                ¡Oops! Algo salió mal
              </h1>
              <p className="text-gray-600 dark:text-gray-400">
                Error: {this.state.error?.message || 'Ha ocurrido un error inesperado'}
              </p>
            </div>

            <div className="space-y-4">
              <p className="text-sm text-gray-500 dark:text-gray-400">
                Status: {this.state.error?.status || 'Desconocido'}
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
    }

    return this.props.children;
  }
}

export default ErrorBoundary;
