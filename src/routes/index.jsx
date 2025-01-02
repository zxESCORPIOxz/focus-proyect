import React, { lazy } from 'react';
import { Routes, Route, Navigate } from 'react-router-dom'

import ErrorBoundary from '../components/ErrorBoundary';
import { AuthProvider, useAuthContext } from '../context/AuthContext';
import LoadingSpinner from '../components/LoadingSpinner';
import { RegisterProvider } from '../context/RegisterContext';
import RecuperarContraseña from '../pages/RecuperarContraseña';




const Login = lazy(() => import('../pages/Login'));
const Rol = lazy(() => import('../pages/Rol'));
const Dashboard = lazy(() => import('../pages/dashboard'))
const Registro = lazy(() => import('../pages/Registro'))

const ProtectedRoute = ({ children }) => {
  const { user } = useAuthContext();
  
  if (!user) {
    return <Navigate to="/" replace />;
  }

  return children;
};

const AppRoutes = () => {
  return (
    <React.Suspense fallback={<LoadingSpinner />}>
      <AuthProvider>
      <RegisterProvider>
        <Routes>
          <Route
            path="/"
            element={<Login />}
            errorElement={<ErrorBoundary />}
          />
          <Route
            path="/roles"
            element={
              <ProtectedRoute>
                <Rol />
              </ProtectedRoute>
            }
            errorElement={<ErrorBoundary />}
          />
          <Route
            path="/dashboard"
            element={
              <ProtectedRoute>
                <Dashboard/>
              /</ProtectedRoute>
            }
            errorElement={<ErrorBoundary />}
          />
             <Route
              path="/recuperarContraseña"
              element={<RecuperarContraseña />}
              errorElement={<ErrorBoundary />}
            />
            <Route
              path="/registro"
              element={<Registro />}
              errorElement={<ErrorBoundary />}
            />
          
          

          
          <Route
            path="*"
            element={<ErrorBoundary />}
          />
        </Routes>
        </RegisterProvider>
      </AuthProvider>
      
    </React.Suspense>
  );
};
  
  export default AppRoutes;