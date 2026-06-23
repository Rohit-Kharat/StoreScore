import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { Toast } from '../components/Toast';

interface StoreItem {
  id: number;
  name: string;
  email: string;
  address: string;
  overallRating: number;
  userRating: number | null;
  totalRatings: number;
}

export const NormalDashboard: React.FC = () => {
  const { token } = useAuth();
  const [stores, setStores] = useState<StoreItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  // Search/Filter state
  const [searchName, setSearchName] = useState('');
  const [searchAddress, setSearchAddress] = useState('');
  const [sortField, setSortField] = useState<'name' | 'address' | 'overallRating'>('name');
  const [sortOrder, setSortOrder] = useState<'ASC' | 'DESC'>('ASC');

  // Rating Modal state
  const [selectedStore, setSelectedStore] = useState<StoreItem | null>(null);
  const [ratingScore, setRatingScore] = useState<number>(0);
  const [hoverScore, setHoverScore] = useState<number>(0);
  const [submitLoading, setSubmitLoading] = useState(false);

  // Password update state
  const [oldPassword, setOldPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [passwordLoading, setPasswordLoading] = useState(false);
  const [passwordErrors, setPasswordErrors] = useState('');

  const [toast, setToast] = useState<{ message: string; type: 'success' | 'error' } | null>(null);
  const [activeTab, setActiveTab] = useState<'stores' | 'settings'>('stores');

  const fetchStores = async () => {
    try {
      const queryParams = new URLSearchParams();
      if (searchName) queryParams.append('name', searchName);
      if (searchAddress) queryParams.append('address', searchAddress);
      queryParams.append('sortField', sortField);
      queryParams.append('sortOrder', sortOrder);

      const response = await fetch(`http://localhost:5000/stores?${queryParams.toString()}`, {
        headers: {
          'Authorization': `Bearer ${token}`,
        },
      });

      const data = await response.json();
      if (!response.ok) {
        throw new Error(data.message || 'Failed to fetch stores.');
      }
      setStores(data);
    } catch (err: any) {
      setError(err.message || 'Could not load stores.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (token) {
      fetchStores();
    }
  }, [token, searchName, searchAddress, sortField, sortOrder]);

  const openRatingModal = (store: StoreItem) => {
    setSelectedStore(store);
    setRatingScore(store.userRating || 0);
  };

  const closeRatingModal = () => {
    setSelectedStore(null);
    setRatingScore(0);
    setHoverScore(0);
  };

  const handleRatingSubmit = async () => {
    if (!selectedStore) return;
    if (ratingScore < 1 || ratingScore > 5) {
      setToast({ message: 'Please select a rating between 1 and 5.', type: 'error' });
      return;
    }

    setSubmitLoading(true);

    try {
      const response = await fetch('http://localhost:5000/ratings', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
        },
        body: JSON.stringify({
          score: ratingScore,
          storeId: selectedStore.id,
        }),
      });

      const data = await response.json();
      if (!response.ok) {
        throw new Error(data.message || 'Failed to submit rating.');
      }

      setToast({
        message: selectedStore.userRating
          ? 'Rating updated successfully!'
          : 'Rating submitted successfully!',
        type: 'success',
      });
      
      closeRatingModal();
      fetchStores(); // Refresh store list ratings
    } catch (err: any) {
      setToast({ message: err.message || 'Failed to submit rating.', type: 'error' });
    } finally {
      setSubmitLoading(false);
    }
  };

  const handlePasswordUpdate = async (e: React.FormEvent) => {
    e.preventDefault();
    setPasswordErrors('');

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
      setActiveTab('stores');
    } catch (err: any) {
      setPasswordErrors(err.message || 'Failed to update password.');
    } finally {
      setPasswordLoading(false);
    }
  };

  const renderStars = (score: number, hoverVal?: number) => {
    const displayVal = hoverVal || score;
    return Array.from({ length: 5 }, (_, i) => (
      <span key={i} style={{ color: i < displayVal ? 'var(--accent-amber)' : 'rgba(255,255,255,0.1)' }}>
        ★
      </span>
    ));
  };

  return (
    <div className="dashboard-container">
      <div className="tabs-header">
        <button className={`tab-btn ${activeTab === 'stores' ? 'active' : ''}`} onClick={() => setActiveTab('stores')}>
          Explore Stores
        </button>
        <button className={`tab-btn ${activeTab === 'settings' ? 'active' : ''}`} onClick={() => setActiveTab('settings')}>
          Update Password
        </button>
      </div>

      {activeTab === 'stores' && (
        <>
          {/* Actions & Filters Bar */}
          <div className="actions-bar glass-panel" style={{ padding: '1rem', marginBottom: '2rem' }}>
            <div className="filters-wrapper">
              <input
                type="text"
                className="input-field filter-input"
                placeholder="Search by store name..."
                value={searchName}
                onChange={(e) => setSearchName(e.target.value)}
              />
              <input
                type="text"
                className="input-field filter-input"
                placeholder="Search by address..."
                value={searchAddress}
                onChange={(e) => setSearchAddress(e.target.value)}
              />
            </div>
            
            <div className="filters-wrapper">
              <span style={{ fontSize: '0.85rem', color: 'var(--text-muted)' }}>Sort By:</span>
              <select
                className="filter-select"
                value={sortField}
                onChange={(e) => setSortField(e.target.value as any)}
              >
                <option value="name">Store Name</option>
                <option value="address">Address</option>
                <option value="overallRating">Average Rating</option>
              </select>

              <select
                className="filter-select"
                value={sortOrder}
                onChange={(e) => setSortOrder(e.target.value as any)}
              >
                <option value="ASC">Ascending</option>
                <option value="DESC">Descending</option>
              </select>
            </div>
          </div>

          {loading && stores.length === 0 ? (
            <div style={{ textAlign: 'center', padding: '3rem' }}>
              <div className="spinner" style={{ margin: '0 auto' }}></div>
            </div>
          ) : error ? (
            <div className="glass-panel" style={{ textAlign: 'center', borderLeftColor: 'var(--accent-rose)', borderLeftWidth: '4px' }}>
              <p>{error}</p>
              <button className="btn btn-primary" onClick={fetchStores}>Retry</button>
            </div>
          ) : stores.length === 0 ? (
            <div className="empty-state glass-panel">No stores found matching your search criteria.</div>
          ) : (
            <div className="stores-grid">
              {stores.map((store) => (
                <div className="store-card glass-panel" key={store.id}>
                  <div className="store-card-header">
                    <h3 className="store-card-name">{store.name}</h3>
                    <p className="store-card-email">{store.email}</p>
                  </div>
                  
                  <p className="store-card-address">{store.address}</p>

                  <div className="store-rating-info">
                    <div className="store-rating-block">
                      <span className="rating-label">Overall Rating</span>
                      <span className="rating-value">
                        ★ {store.overallRating > 0 ? store.overallRating.toFixed(2) : 'No reviews'}
                      </span>
                    </div>

                    <div className="store-rating-block" style={{ marginLeft: 'auto', textAlign: 'right' }}>
                      <span className="rating-label">Your Rating</span>
                      <span className="rating-value-small">
                        {store.userRating ? renderStars(store.userRating) : 'Not rated yet'}
                      </span>
                    </div>
                  </div>

                  <div className="store-card-footer">
                    <button
                      className="btn btn-primary"
                      style={{ width: '100%', padding: '0.5rem' }}
                      onClick={() => openRatingModal(store)}
                    >
                      {store.userRating ? 'Modify Rating' : 'Rate Store'}
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </>
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

      {/* Rating Submit Modal */}
      {selectedStore && (
        <div className="modal-overlay" onClick={closeRatingModal}>
          <div className="modal-content glass-panel" onClick={(e) => e.stopPropagation()}>
            <div className="modal-header">
              <h3>{selectedStore.userRating ? 'Modify Rating' : 'Rate Store'}</h3>
              <button className="modal-close-btn" onClick={closeRatingModal}>&times;</button>
            </div>
            
            <p style={{ color: 'var(--text-muted)', marginBottom: '1rem' }}>
              How would you rate your experience at <strong>{selectedStore.name}</strong>?
            </p>

            <div className="stars-selection">
              {Array.from({ length: 5 }, (_, i) => {
                const starVal = i + 1;
                return (
                  <button
                    key={i}
                    type="button"
                    className={`star-btn ${starVal <= (hoverScore || ratingScore) ? 'active' : ''}`}
                    onClick={() => setRatingScore(starVal)}
                    onMouseEnter={() => setHoverScore(starVal)}
                    onMouseLeave={() => setHoverScore(0)}
                  >
                    ★
                  </button>
                );
              })}
            </div>

            <div style={{ textAlign: 'center', marginTop: '0.5rem', color: 'var(--text-dim)', fontSize: '0.9rem' }}>
              {ratingScore > 0 ? `Selected: ${ratingScore} Star${ratingScore > 1 ? 's' : ''}` : 'Choose a score'}
            </div>

            <div style={{ display: 'flex', gap: '1rem', marginTop: '2rem', justifyContent: 'flex-end' }}>
              <button className="btn btn-secondary" onClick={closeRatingModal} disabled={submitLoading}>
                Cancel
              </button>
              <button
                className="btn btn-primary"
                onClick={handleRatingSubmit}
                disabled={submitLoading || ratingScore === 0}
              >
                {submitLoading ? 'Submitting...' : 'Save Review'}
              </button>
            </div>
          </div>
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
export default NormalDashboard;
