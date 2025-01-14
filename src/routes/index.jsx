import React, { lazy } from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';

import ErrorBoundary from '../components/ErrorBoundary';

import LoadingSpinner from '../components/LoadingSpinner';
import { useAuthContext } from '../context/AuthContext';
// import Rol2 from '../pages/Rol/index2';


const Login = lazy(() => import('../pages/Login'));
const Rol2 = lazy(() => import('../pages/Rol/index2'));
const Dashboard = lazy(() => import('../pages/Dashboard'));
const Registro = lazy(() => import('../pages/Registro'));
const RecuperarContraseña = lazy(() => import('../pages/RecuperarContraseña'));

const ProtectedRoute = ({ children }) => {
  const { user } = useAuthContext();
  
  if (!user) {
    return <Navigate to="/login" replace />;
  }

  return children;
};

const AppRoutes = () => {
    return (
      <React.Suspense fallback={<LoadingSpinner />}>
          <Routes>
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
            <Route path="/" element={<Navigate to="/login" />} />
            <Route
              path="/login"
              element={<Login />}
              errorElement={<ErrorBoundary />}
            />
            <Route
              path="/roles"
              element={
                <ProtectedRoute>
                  <Rol2 />
                </ProtectedRoute>
              }
              errorElement={<ErrorBoundary />}
            />
            <Route
              path="/dashboard"
              element={
                <ProtectedRoute>
                  <Dashboard/>
                </ProtectedRoute>
              }
              errorElement={<ErrorBoundary />}
            />
              
            
            
  
            
            <Route
              path="*"
              element={<ErrorBoundary />}
            />
          </Routes>

        
      </React.Suspense>
    );
  };
export default AppRoutes;
