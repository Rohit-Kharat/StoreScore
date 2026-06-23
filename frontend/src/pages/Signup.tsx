import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Toast } from '../components/Toast';

export const Signup: React.FC = () => {
  const navigate = useNavigate();
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [address, setAddress] = useState('');
  const [password, setPassword] = useState('');
  
  const [errors, setErrors] = useState<{ [key: string]: string }>({});
  const [loading, setLoading] = useState(false);
  const [toast, setToast] = useState<{ message: string; type: 'success' | 'error' } | null>(null);

  // Real-time or submit-time validation rules
  const validateForm = () => {
    const tempErrors: { [key: string]: string } = {};

    // Name: Min 20, Max 60
    if (!name) {
      tempErrors.name = 'Name is required.';
    } else if (name.length < 20 || name.length > 60) {
      tempErrors.name = `Name must be between 20 and 60 characters (currently ${name.length}).`;
    }

    // Email validation
    if (!email) {
      tempErrors.email = 'Email is required.';
    } else if (!/\S+@\S+\.\S+/.test(email)) {
      tempErrors.email = 'Must follow standard email validation rules.';
    }

    // Address: Max 400
    if (!address) {
      tempErrors.address = 'Address is required.';
    } else if (address.length > 400) {
      tempErrors.address = `Address cannot exceed 400 characters (currently ${address.length}).`;
    }

    // Password: 8-16, 1 uppercase, 1 special char
    const passwordRegex = /^(?=.*[A-Z])(?=.*[!@#$%^&*(),.?":{}|<>])/;
    if (!password) {
      tempErrors.password = 'Password is required.';
    } else if (password.length < 8 || password.length > 16) {
      tempErrors.password = `Password must be between 8 and 16 characters (currently ${password.length}).`;
    } else if (!passwordRegex.test(password)) {
      tempErrors.password = 'Password must include at least one uppercase letter and one special character.';
    }

    setErrors(tempErrors);
    return Object.keys(tempErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!validateForm()) {
      setToast({ message: 'Please correct the validation errors.', type: 'error' });
      return;
    }

    setLoading(true);

    try {
      const response = await fetch('http://localhost:5000/auth/signup', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ name, email, address, password }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || 'Signup failed.');
      }

      setToast({ message: 'Account registered successfully! Redirecting...', type: 'success' });
      setTimeout(() => {
        navigate('/login');
      }, 1500);
    } catch (err: any) {
      setToast({ message: err.message || 'Something went wrong.', type: 'error' });
      setLoading(false);
    }
  };

  return (
    <div className="auth-page">
      <div className="glow-bg"></div>
      <div className="glow-bg-secondary"></div>

      <div className="auth-card glass-panel" style={{ maxWidth: '520px' }}>
        <div className="auth-header">
          <div className="auth-logo"><span className="gradient-text">TrustStore</span></div>
          <p className="auth-subtitle">Create your shopper account to browse and rate stores.</p>
        </div>

        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label className="form-label">Full Name (Min 20, Max 60 chars)</label>
            <input
              type="text"
              className="input-field"
              placeholder="e.g. Johnathan Doe Customer Account"
              value={name}
              onChange={(e) => setName(e.target.value)}
              disabled={loading}
            />
            {errors.name && <span className="error-text">{errors.name}</span>}
          </div>

          <div className="form-group">
            <label className="form-label">Email Address</label>
            <input
              type="text"
              className="input-field"
              placeholder="e.g. customer@example.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              disabled={loading}
            />
            {errors.email && <span className="error-text">{errors.email}</span>}
          </div>

          <div className="form-group">
            <label className="form-label">Residential Address (Max 400 chars)</label>
            <textarea
              className="input-field"
              style={{ minHeight: '80px', resize: 'vertical' }}
              placeholder="e.g. 123 Residential Lane, Apartment 4B..."
              value={address}
              onChange={(e) => setAddress(e.target.value)}
              disabled={loading}
            />
            {errors.address && <span className="error-text">{errors.address}</span>}
          </div>

          <div className="form-group">
            <label className="form-label">Password (8-16 chars, 1 uppercase, 1 special)</label>
            <input
              type="password"
              className="input-field"
              placeholder="••••••••"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              disabled={loading}
            />
            {errors.password && <span className="error-text">{errors.password}</span>}
          </div>

          <button type="submit" className="btn btn-primary" style={{ width: '100%', marginTop: '0.5rem' }} disabled={loading}>
            {loading ? 'Creating Account...' : 'Register'}
          </button>
        </form>

        <div className="auth-footer">
          Already have an account? <a href="/login">Sign In</a>
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
export default Signup;
