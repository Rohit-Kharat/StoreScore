import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { Toast } from '../components/Toast';

export const Login: React.FC = () => {
  const { login } = useAuth();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [toast, setToast] = useState<{ message: string; type: 'success' | 'error' } | null>(null);

  
  const validateEmail = (val: string) => {
    return /\S+@\S+\.\S+/.test(val);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!email) {
      setToast({ message: 'Email is required.', type: 'error' });
      return;
    }
    if (!validateEmail(email)) {
      setToast({ message: 'Please enter a valid email address.', type: 'error' });
      return;
    }
    if (!password) {
      setToast({ message: 'Password is required.', type: 'error' });
      return;
    }

    setLoading(true);

    try {
      const response = await fetch('http://localhost:5000/auth/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email, password }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || 'Login failed.');
      }

      setToast({ message: 'Login successful!', type: 'success' });
      
      
      setTimeout(() => {
        login(data.accessToken, data.user);
      }, 800);
    } catch (err: any) {
      setToast({ message: err.message || 'Something went wrong.', type: 'error' });
      setLoading(false);
    }
  };

  return (
    <div className="auth-page">
      <div className="glow-bg"></div>
      <div className="glow-bg-secondary"></div>

      <div className="auth-card glass-panel">
        <div className="auth-header">
          <div className="auth-logo"><span className="gradient-text">TrustStore</span></div>
          <p className="auth-subtitle">Welcome back. Enter your credentials to log in.</p>
        </div>

        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label className="form-label">Email Address</label>
            <input
              type="text"
              className="input-field"
              placeholder="e.g. user@example.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              disabled={loading}
            />
          </div>

          <div className="form-group">
            <label className="form-label">Password</label>
            <input
              type="password"
              className="input-field"
              placeholder="••••••••"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              disabled={loading}
            />
          </div>

          <button type="submit" className="btn btn-primary" style={{ width: '100%', marginTop: '0.5rem' }} disabled={loading}>
            {loading ? 'Authenticating...' : 'Sign In'}
          </button>
        </form>

        <div className="auth-footer">
          Don't have an account? <a href="/signup">Sign up as Normal User</a>
        </div>
      </div>

      {toast && (
        <div className="toast-container">
          <Toast message={toast.message} type={toast.type} onClose={() => setToast(null)} />
        </div>
      )}
    </div>
  );
};
export default Login;
