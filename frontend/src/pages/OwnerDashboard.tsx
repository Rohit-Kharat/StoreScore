import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { Toast } from '../components/Toast';

interface RatingLog {
  id: number;
  score: number;
  date: string;
  user: {
    id: number;
    name: string;
    email: string;
  };
}

interface StoreData {
  id: number;
  name: string;
  email: string;
  address: string;
  averageRating: number;
  ratings: RatingLog[];
}

export const OwnerDashboard: React.FC = () => {
  const { token } = useAuth();
  const [store, setStore] = useState<StoreData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  
  // Sort state
  const [sortField, setSortField] = useState<'name' | 'score' | 'date'>('date');
  const [sortOrder, setSortOrder] = useState<'ASC' | 'DESC'>('DESC');

  // Password state
  const [oldPassword, setOldPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [passwordLoading, setPasswordLoading] = useState(false);
  const [passwordErrors, setPasswordErrors] = useState('');

  const [toast, setToast] = useState<{ message: string; type: 'success' | 'error' } | null>(null);
  const [activeTab, setActiveTab] = useState<'dashboard' | 'settings'>('dashboard');

  const fetchStoreData = async () => {
    try {
      const response = await fetch('http://localhost:5000/stores/my-store', {
        headers: {
          'Authorization': `Bearer ${token}`,
        },
      });

      const data = await response.json();
      if (!response.ok) {
        throw new Error(data.message || 'Failed to fetch store dashboard.');
      }
      setStore(data);
    } catch (err: any) {
      setError(err.message || 'Could not load your store statistics.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (token) {
      fetchStoreData();
    }
  }, [token]);

  const handleSort = (field: 'name' | 'score' | 'date') => {
    if (sortField === field) {
      setSortOrder(sortOrder === 'ASC' ? 'DESC' : 'ASC');
    } else {
      setSortField(field);
      setSortOrder('DESC'); // Default to descending
    }
  };

  // Get sorted ratings list
  const getSortedRatings = () => {
    if (!store || !store.ratings) return [];
    
    const sorted = [...store.ratings];
    sorted.sort((a, b) => {
      let valA: any;
      let valB: any;

      if (sortField === 'name') {
        valA = a.user.name.toLowerCase();
        valB = b.user.name.toLowerCase();
      } else if (sortField === 'score') {
        valA = a.score;
        valB = b.score;
      } else {
        valA = new Date(a.date).getTime();
        valB = new Date(b.date).getTime();
      }

      if (valA < valB) return sortOrder === 'ASC' ? -1 : 1;
      if (valA > valB) return sortOrder === 'ASC' ? 1 : -1;
      return 0;
    });

    return sorted;
  };

  const handlePasswordUpdate = async (e: React.FormEvent) => {
    e.preventDefault();
    setPasswordErrors('');

    // Validations
    if (!oldPassword) {
      setPasswordErrors('Current password is required.');
      return;
    }
    const passwordRegex = /^(?=.*[A-Z])(?=.*[!@#$%^&*(),.?":{}|<>])/;
    if (newPassword.length < 8 || newPassword.length > 16) {
      setPasswordErrors(`New password must be between 8 and 16 characters (currently ${newPassword.length}).`);
      return;
    }
    if (!passwordRegex.test(newPassword)) {
      setPasswordErrors('New password must include at least one uppercase letter and one special character.');
      return;
    }

    setPasswordLoading(true);

    try {
      const response = await fetch('http://localhost:5000/users/update-password', {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
        },
        body: JSON.stringify({ oldPassword, newPassword }),
      });

      const data = await response.json();
      if (!response.ok) {
        throw new Error(data.message || 'Failed to update password.');
      }

      setToast({ message: 'Password updated successfully!', type: 'success' });
      setOldPassword('');
      setNewPassword('');
      setActiveTab('dashboard');
    } catch (err: any) {
      setPasswordErrors(err.message || 'Failed to update password.');
    } finally {
      setPasswordLoading(false);
    }
  };

  const renderStars = (score: number) => {
    return Array.from({ length: 5 }, (_, i) => (
      <span key={i} style={{ color: i < score ? 'var(--accent-amber)' : 'rgba(255,255,255,0.1)' }}>
        ★
      </span>
    ));
  };

  if (loading) {
    return (
      <div className="dashboard-container" style={{ textAlign: 'center', paddingTop: '5rem' }}>
        <div className="spinner" style={{ margin: '0 auto' }}></div>
        <p style={{ marginTop: '1rem', color: 'var(--text-muted)' }}>Loading Store Dashboard...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="dashboard-container">
        <div className="glass-panel" style={{ textAlign: 'center', borderLeftColor: 'var(--accent-rose)', borderLeftWidth: '4px' }}>
          <h3>Dashboard Error</h3>
          <p style={{ margin: '1rem 0', color: 'var(--text-muted)' }}>{error}</p>
          <button className="btn btn-primary" onClick={fetchStoreData}>Retry</button>
        </div>
      </div>
    );
  }

  const sortedRatings = getSortedRatings();

  return (
    <div className="dashboard-container">
      <div className="tabs-header">
        <button className={`tab-btn ${activeTab === 'dashboard' ? 'active' : ''}`} onClick={() => setActiveTab('dashboard')}>
          Store Analytics
        </button>
        <button className={`tab-btn ${activeTab === 'settings' ? 'active' : ''}`} onClick={() => setActiveTab('settings')}>
          Update Password
        </button>
      </div>

      {activeTab === 'dashboard' && store && (
        <div className="dash-layout-grid">
          {/* Main Rating Log */}
          <div className="glass-panel">
            <h3 style={{ marginBottom: '1.5rem' }}>Customer Ratings Log</h3>
            {sortedRatings.length === 0 ? (
              <div className="empty-state">No ratings have been submitted for your store yet.</div>
            ) : (
              <div className="table-container">
                <table className="data-table">
                  <thead>
                    <tr>
                      <th onClick={() => handleSort('name')} style={{ cursor: 'pointer' }}>
                        <div className="sortable-header">
                          Customer Name {sortField === 'name' ? (sortOrder === 'ASC' ? '↑' : '↓') : ''}
                        </div>
                      </th>
                      <th onClick={() => handleSort('score')} style={{ cursor: 'pointer' }}>
                        <div className="sortable-header">
                          Rating {sortField === 'score' ? (sortOrder === 'ASC' ? '↑' : '↓') : ''}
                        </div>
                      </th>
                      <th onClick={() => handleSort('date')} style={{ cursor: 'pointer' }}>
                        <div className="sortable-header">
                          Submitted Date {sortField === 'date' ? (sortOrder === 'ASC' ? '↑' : '↓') : ''}
                        </div>
                      </th>
                    </tr>
                  </thead>
                  <tbody>
                    {sortedRatings.map((rating) => (
                      <tr key={rating.id}>
                        <td style={{ fontWeight: 600 }}>{rating.user.name}</td>
                        <td style={{ fontSize: '1.15rem' }}>{renderStars(rating.score)}</td>
                        <td style={{ color: 'var(--text-muted)' }}>
                          {new Date(rating.date).toLocaleDateString(undefined, {
                            year: 'numeric',
                            month: 'long',
                            day: 'numeric',
                            hour: '2-digit',
                            minute: '2-digit',
                          })}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>

          {/* Store info sidebar */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
            <div className="glass-panel" style={{ borderTop: '4px solid var(--accent-purple)' }}>
              <h4 style={{ marginBottom: '1rem', color: 'var(--accent-purple)' }}>Store Overview</h4>
              <h2 style={{ fontSize: '1.5rem', marginBottom: '0.25rem' }}>{store.name}</h2>
              <p style={{ fontSize: '0.85rem', color: 'var(--text-dim)', marginBottom: '1rem' }}>{store.email}</p>
              
              <p style={{ fontSize: '0.9rem', color: 'var(--text-muted)', marginBottom: '1.5rem' }}>
                <strong>Address:</strong><br />
                {store.address}
              </p>

              <div className="store-rating-info" style={{ marginBottom: 0 }}>
                <div className="store-rating-block">
                  <span className="rating-label">Average Score</span>
                  <span className="rating-value" style={{ fontSize: '1.8rem' }}>
                    ★ {store.averageRating}
                  </span>
                </div>
                <div className="store-rating-block" style={{ marginLeft: 'auto', textAlign: 'right' }}>
                  <span className="rating-label">Total Reviews</span>
                  <span className="rating-value-small" style={{ fontSize: '1.4rem', fontWeight: 800 }}>
                    {store.ratings.length}
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {activeTab === 'settings' && (
        <div className="glass-panel" style={{ maxWidth: '500px', margin: '0 auto' }}>
          <h3 style={{ marginBottom: '1.5rem' }}>Change Account Password</h3>
          <form onSubmit={handlePasswordUpdate}>
            <div className="form-group">
              <label className="form-label">Current Password</label>
              <input
                type="password"
                className="input-field"
                placeholder="Enter current password"
                value={oldPassword}
                onChange={(e) => setOldPassword(e.target.value)}
                disabled={passwordLoading}
              />
            </div>

            <div className="form-group">
              <label className="form-label">New Password (8-16 chars, 1 uppercase, 1 special)</label>
              <input
                type="password"
                className="input-field"
                placeholder="Enter new password"
                value={newPassword}
                onChange={(e) => setNewPassword(e.target.value)}
                disabled={passwordLoading}
              />
            </div>

            {passwordErrors && <p className="error-text" style={{ marginBottom: '1rem' }}>{passwordErrors}</p>}

            <button type="submit" className="btn btn-primary" style={{ width: '100%' }} disabled={passwordLoading}>
              {passwordLoading ? 'Updating Password...' : 'Save Password'}
            </button>
          </form>
        </div>
      )}

      {toast && (
        <div className="toast-container">
          <Toast message={toast.message} type={toast.type} onClose={() => setToast(null)} />
        </div>
      )}
    </div>
  );
};
export default OwnerDashboard;
