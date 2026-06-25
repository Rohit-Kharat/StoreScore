import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider, useAuth } from './context/AuthContext';
import Login from './pages/Login';
import Signup from './pages/Signup';
import AdminDashboard from './pages/AdminDashboard';
import NormalDashboard from './pages/NormalDashboard';
import OwnerDashboard from './pages/OwnerDashboard';
import { Navbar } from './components/Navbar';


const PublicRoute: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { isAuthenticated, user } = useAuth();
  
  if (isAuthenticated && user) {
   
    return <Navigate to={`/${user.role}`} replace />;
  }
  
  return <>{children}</>;
};


const ProtectedRoute: React.FC<{ children: React.ReactNode; allowedRole: 'admin' | 'normal' | 'owner' }> = ({ children, allowedRole }) => {
  const { isAuthenticated, user } = useAuth();

  if (!isAuthenticated || !user) {
    return <Navigate to="/login" replace />;
  }

  if (user.role !== allowedRole) {
    
    return <Navigate to={`/${user.role}`} replace />;
  }

  return (
    <div className="app-container">
      <div className="glow-bg"></div>
      <div className="glow-bg-secondary"></div>
      <Navbar />
      {children}
    </div>
  );
};


const RootRedirect: React.FC = () => {
  const { isAuthenticated, user } = useAuth();

  if (isAuthenticated && user) {
    return <Navigate to={`/${user.role}`} replace />;
  }

  return <Navigate to="/login" replace />;
};

function App() {
  return (
    <AuthProvider>
      <Router>
        <Routes>
          
          <Route path="/login" element={<PublicRoute><Login /></PublicRoute>} />
          <Route path="/signup" element={<PublicRoute><Signup /></PublicRoute>} />

          
          <Route 
            path="/admin" 
            element={
              <ProtectedRoute allowedRole="admin">
                <AdminDashboard />
              </ProtectedRoute>
            } 
          />
          <Route 
            path="/normal" 
            element={
              <ProtectedRoute allowedRole="normal">
                <NormalDashboard />
              </ProtectedRoute>
            } 
          />
          <Route 
            path="/owner" 
            element={
              <ProtectedRoute allowedRole="owner">
                <OwnerDashboard />
              </ProtectedRoute>
            } 
          />

          
          <Route path="/" element={<RootRedirect />} />
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </Router>
    </AuthProvider>
  );
}

export default App;
