import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { Toast } from '../components/Toast';

interface AdminStats {
  totalUsers: number;
  totalStores: number;
  totalRatings: number;
}

interface UserListItem {
  id: number;
  name: string;
  email: string;
  address: string;
  role: 'admin' | 'normal' | 'owner';
  createdAt: string;
}

interface StoreListItem {
  id: number;
  name: string;
  email: string;
  address: string;
  overallRating: number;
  owner: { id: number; name: string; email: string } | null;
  totalRatings: number;
}

export const AdminDashboard: React.FC = () => {
  const { token } = useAuth();
  const [stats, setStats] = useState<AdminStats | null>(null);
  const [users, setUsers] = useState<UserListItem[]>([]);
  const [stores, setStores] = useState<StoreListItem[]>([]);
  const [loadingStats, setLoadingStats] = useState(true);
  const [loadingUsers, setLoadingUsers] = useState(true);
  const [loadingStores, setLoadingStores] = useState(true);

  
  const [activeSubTab, setActiveSubTab] = useState<'stats' | 'users' | 'stores'>('stats');

  
  const [userFilterName, setUserFilterName] = useState('');
  const [userFilterEmail, setUserFilterEmail] = useState('');
  const [userFilterAddress, setUserFilterAddress] = useState('');
  const [userFilterRole, setUserFilterRole] = useState('');
  const [userSortField, setUserSortField] = useState('name');
  const [userSortOrder, setUserSortOrder] = useState<'ASC' | 'DESC'>('ASC');

  
  const [storeFilterName, setStoreFilterName] = useState('');
  const [storeFilterAddress, setStoreFilterAddress] = useState('');
  const [storeSortField, setStoreSortField] = useState('name');
  const [storeSortOrder, setStoreSortOrder] = useState<'ASC' | 'DESC'>('ASC');

  
  const [showAddUserModal, setShowAddUserModal] = useState(false);
  const [showAddStoreModal, setShowAddStoreModal] = useState(false);
  const [detailedUser, setDetailedUser] = useState<any | null>(null);
  const [, setLoadingDetail] = useState(false);

  
  const [newUserName, setNewUserName] = useState('');
  const [newUserEmail, setNewUserEmail] = useState('');
  const [newUserAddress, setNewUserAddress] = useState('');
  const [newUserPassword, setNewUserPassword] = useState('');
  const [newUserRole, setNewUserRole] = useState<'admin' | 'normal' | 'owner'>('normal');
  const [userFormErrors, setUserFormErrors] = useState<{ [key: string]: string }>({});

  
  const [newStoreName, setNewStoreName] = useState('');
  const [newStoreEmail, setNewStoreEmail] = useState('');
  const [newStoreAddress, setNewStoreAddress] = useState('');
  const [newStoreOwnerId, setNewStoreOwnerId] = useState<string>('');
  const [storeFormErrors, setStoreFormErrors] = useState<{ [key: string]: string }>({});
  
  
  const [allOwners, setAllOwners] = useState<UserListItem[]>([]);

  const [toast, setToast] = useState<{ message: string; type: 'success' | 'error' } | null>(null);

  
  const [oldPassword, setOldPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [passwordLoading, setPasswordLoading] = useState(false);
  const [passwordErrors, setPasswordErrors] = useState('');
  const [showPasswordModal, setShowPasswordModal] = useState(false);

  
  const fetchStats = async () => {
    try {
      const response = await fetch('http://localhost:5000/admin/stats', {
        headers: { 'Authorization': `Bearer ${token}` },
      });
      const data = await response.json();
      if (response.ok) setStats(data);
    } catch (e) {
      console.error(e);
    } finally {
      setLoadingStats(false);
    }
  };

  const fetchUsers = async () => {
    setLoadingUsers(true);
    try {
      const params = new URLSearchParams();
      if (userFilterName) params.append('name', userFilterName);
      if (userFilterEmail) params.append('email', userFilterEmail);
      if (userFilterAddress) params.append('address', userFilterAddress);
      if (userFilterRole) params.append('role', userFilterRole);
      params.append('sortField', userSortField);
      params.append('sortOrder', userSortOrder);

      const response = await fetch(`http://localhost:5000/users?${params.toString()}`, {
        headers: { 'Authorization': `Bearer ${token}` },
      });
      const data = await response.json();
      if (response.ok) setUsers(data);
    } catch (e) {
      console.error(e);
    } finally {
      setLoadingUsers(false);
    }
  };

  const fetchStores = async () => {
    setLoadingStores(true);
    try {
      const params = new URLSearchParams();
      if (storeFilterName) params.append('name', storeFilterName);
      if (storeFilterAddress) params.append('address', storeFilterAddress);
      params.append('sortField', storeSortField);
      params.append('sortOrder', storeSortOrder);

      const response = await fetch(`http://localhost:5000/stores?${params.toString()}`, {
        headers: { 'Authorization': `Bearer ${token}` },
      });
      const data = await response.json();
      if (response.ok) setStores(data);
    } catch (e) {
      console.error(e);
    } finally {
      setLoadingStores(false);
    }
  };

  
  const fetchOwners = async () => {
    try {
      const response = await fetch('http://localhost:5000/users?role=owner', {
        headers: { 'Authorization': `Bearer ${token}` },
      });
      const data = await response.json();
      if (response.ok) setAllOwners(data);
    } catch (e) {
      console.error(e);
    }
  };

  useEffect(() => {
    if (token) {
      fetchStats();
      fetchUsers();
      fetchStores();
      fetchOwners();
    }
  }, [token]);

  
  useEffect(() => {
    if (token) fetchUsers();
  }, [userFilterName, userFilterEmail, userFilterAddress, userFilterRole, userSortField, userSortOrder]);

  useEffect(() => {
    if (token) fetchStores();
  }, [storeFilterName, storeFilterAddress, storeSortField, storeSortOrder]);

  
  const handleUserSort = (field: string) => {
    if (userSortField === field) {
      setUserSortOrder(userSortOrder === 'ASC' ? 'DESC' : 'ASC');
    } else {
      setUserSortField(field);
      setUserSortOrder('ASC');
    }
  };

  const handleStoreSort = (field: string) => {
    if (storeSortField === field) {
      setStoreSortOrder(storeSortOrder === 'ASC' ? 'DESC' : 'ASC');
    } else {
      setStoreSortField(field);
      setStoreSortOrder('ASC');
    }
  };

  
  const handleViewUserDetail = async (userId: number) => {
    setLoadingDetail(true);
    try {
      const response = await fetch(`http://localhost:5000/users/${userId}`, {
        headers: { 'Authorization': `Bearer ${token}` },
      });
      const data = await response.json();
      if (!response.ok) throw new Error(data.message || 'Failed to fetch details');
      setDetailedUser(data);
    } catch (err: any) {
      setToast({ message: err.message, type: 'error' });
    } finally {
      setLoadingDetail(false);
    }
  };



  const executeAddUser = async () => {
    
    try {
      const response = await fetch('http://localhost:5000/users', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
        },
        body: JSON.stringify({
          name: newUserName,
          email: newUserEmail,
          address: newUserAddress,
          password: newUserPassword,
          role: newUserRole,
        }),
      });

      const data = await response.json();
      if (!response.ok) {
        throw new Error(data.message || 'Failed to create user');
      }

      setToast({ message: 'User created successfully!', type: 'success' });
      setShowAddUserModal(false);
      
      
      setNewUserName('');
      setNewUserEmail('');
      setNewUserAddress('');
      setNewUserPassword('');
      setNewUserRole('normal');
      setUserFormErrors({});

      fetchUsers();
      fetchStats();
      fetchOwners(); 
    } catch (err: any) {
      setToast({ message: err.message, type: 'error' });
    }
  };

  const handleAddUserFormSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const tempErrors: { [key: string]: string } = {};

    if (newUserName.length < 20 || newUserName.length > 60) {
      tempErrors.name = 'Name must be between 20 and 60 characters.';
    }
    if (!/\S+@\S+\.\S+/.test(newUserEmail)) {
      tempErrors.email = 'Must follow standard email validation rules.';
    }
    if (newUserAddress.length > 400 || !newUserAddress) {
      tempErrors.address = 'Address is required and must be maximum 400 characters.';
    }
    const passwordRegex = /^(?=.*[A-Z])(?=.*[!@#$%^&*(),.?":{}|<>])/;
    if (newUserPassword.length < 8 || newUserPassword.length > 16) {
      tempErrors.password = 'Password must be between 8 and 16 characters.';
    } else if (!passwordRegex.test(newUserPassword)) {
      tempErrors.password = 'Password must include at least one uppercase letter and one special character.';
    }

    setUserFormErrors(tempErrors);

    if (Object.keys(tempErrors).length > 0) return;

    executeAddUser();
  };

  
  const handleAddStoreSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const tempErrors: { [key: string]: string } = {};

    if (newStoreName.length < 20 || newStoreName.length > 60) {
      tempErrors.name = 'Store Name must be between 20 and 60 characters.';
    }
    if (!/\S+@\S+\.\S+/.test(newStoreEmail)) {
      tempErrors.email = 'Must follow standard email validation rules.';
    }
    if (newStoreAddress.length > 400 || !newStoreAddress) {
      tempErrors.address = 'Store Address is required and maximum 400 characters.';
    }

    setStoreFormErrors(tempErrors);

    if (Object.keys(tempErrors).length > 0) return;

    try {
      const response = await fetch('http://localhost:5000/stores', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
        },
        body: JSON.stringify({
          name: newStoreName,
          email: newStoreEmail,
          address: newStoreAddress,
          ownerId: newStoreOwnerId ? parseInt(newStoreOwnerId) : undefined,
        }),
      });

      const data = await response.json();
      if (!response.ok) {
        throw new Error(data.message || 'Failed to create store');
      }

      setToast({ message: 'Store created successfully!', type: 'success' });
      setShowAddStoreModal(false);

      // Reset form
      setNewStoreName('');
      setNewStoreEmail('');
      setNewStoreAddress('');
      setNewStoreOwnerId('');
      setStoreFormErrors({});

      fetchStores();
      fetchStats();
    } catch (err: any) {
      setToast({ message: err.message, type: 'error' });
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
      setPasswordErrors(`New password must be between 8 and 16 characters.`);
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
      setShowPasswordModal(false);
    } catch (err: any) {
      setPasswordErrors(err.message || 'Failed to update password.');
    } finally {
      setPasswordLoading(false);
    }
  };



  return (
    <div className="dashboard-container">
      
      <div className="tabs-header" style={{ justifyContent: 'space-between', alignItems: 'center' }}>
        <div style={{ display: 'flex', gap: '0.5rem' }}>
          <button className={`tab-btn ${activeSubTab === 'stats' ? 'active' : ''}`} onClick={() => setActiveSubTab('stats')}>
            Dashboard Overview
          </button>
          <button className={`tab-btn ${activeSubTab === 'users' ? 'active' : ''}`} onClick={() => setActiveSubTab('users')}>
            Manage Users
          </button>
          <button className={`tab-btn ${activeSubTab === 'stores' ? 'active' : ''}`} onClick={() => setActiveSubTab('stores')}>
            Manage Stores
          </button>
        </div>

        <button className="btn btn-secondary" style={{ padding: '0.4rem 1rem', fontSize: '0.85rem' }} onClick={() => setShowPasswordModal(true)}>
          Admin Password
        </button>
      </div>

      
      {activeSubTab === 'stats' && (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '2rem' }}>
          {loadingStats ? (
            <div style={{ textAlign: 'center', padding: '3rem' }}><div className="spinner" style={{ margin: '0 auto' }}></div></div>
          ) : stats ? (
            <div className="stats-grid">
              <div className="stat-card glass-panel">
                <div className="stat-icon">👤</div>
                <div className="stat-info">
                  <span className="stat-label">Total Platform Users</span>
                  <span className="stat-value">{stats.totalUsers}</span>
                </div>
              </div>
              <div className="stat-card glass-panel">
                <div className="stat-icon">🏪</div>
                <div className="stat-info">
                  <span className="stat-label">Registered Stores</span>
                  <span className="stat-value">{stats.totalStores}</span>
                </div>
              </div>
              <div className="stat-card glass-panel">
                <div className="stat-icon">⭐</div>
                <div className="stat-info">
                  <span className="stat-label">Submitted Ratings</span>
                  <span className="stat-value">{stats.totalRatings}</span>
                </div>
              </div>
            </div>
          ) : (
            <div className="empty-state">Stats could not be loaded.</div>
          )}

          <div className="glass-panel" style={{ borderLeft: '4px solid var(--accent-purple)' }}>
            <h4 style={{ marginBottom: '0.5rem' }}>Administrator Console Quick Guide</h4>
            <p style={{ color: 'var(--text-muted)', fontSize: '0.95rem' }}>
              As a System Administrator, you have full control over the platform. You can:
            </p>
            <ul style={{ color: 'var(--text-muted)', fontSize: '0.9rem', paddingLeft: '1.25rem', marginTop: '0.5rem', lineHeight: '1.6' }}>
              <li>Register new stores and assign store owners.</li>
              <li>Create admin users, store owners, and normal customer accounts directly.</li>
              <li>Search and filter records by Name, Email, Address, and Role.</li>
              <li>Sort listings by columns ascending/descending.</li>
              <li>Click on any user in the Users tab to view their full details, including store rating cards for Store Owners.</li>
            </ul>
          </div>
        </div>
      )}

      
      {activeSubTab === 'users' && (
        <div>
          
          <div className="actions-bar glass-panel" style={{ padding: '1rem', marginBottom: '1.5rem' }}>
            <div className="filters-wrapper">
              <input
                type="text"
                className="input-field filter-input"
                placeholder="Filter by name..."
                value={userFilterName}
                onChange={(e) => setUserFilterName(e.target.value)}
              />
              <input
                type="text"
                className="input-field filter-input"
                placeholder="Filter by email..."
                value={userFilterEmail}
                onChange={(e) => setUserFilterEmail(e.target.value)}
              />
              <input
                type="text"
                className="input-field filter-input"
                placeholder="Filter by address..."
                value={userFilterAddress}
                onChange={(e) => setUserFilterAddress(e.target.value)}
              />
              
              <select
                className="filter-select"
                value={userFilterRole}
                onChange={(e) => setUserFilterRole(e.target.value)}
              >
                <option value="">All Roles</option>
                <option value="admin">Admin</option>
                <option value="normal">Normal</option>
                <option value="owner">Store Owner</option>
              </select>
            </div>

            <button className="btn btn-primary" onClick={() => setShowAddUserModal(true)}>
              + Add New User
            </button>
          </div>

          {loadingUsers && users.length === 0 ? (
            <div style={{ textAlign: 'center', padding: '3rem' }}><div className="spinner" style={{ margin: '0 auto' }}></div></div>
          ) : users.length === 0 ? (
            <div className="empty-state glass-panel">No normal/admin users found.</div>
          ) : (
            <div className="table-container">
              <table className="data-table">
                <thead>
                  <tr>
                    <th onClick={() => handleUserSort('name')} style={{ cursor: 'pointer' }}>
                      <div className="sortable-header">
                        Name {userSortField === 'name' ? (userSortOrder === 'ASC' ? '↑' : '↓') : ''}
                      </div>
                    </th>
                    <th onClick={() => handleUserSort('email')} style={{ cursor: 'pointer' }}>
                      <div className="sortable-header">
                        Email {userSortField === 'email' ? (userSortOrder === 'ASC' ? '↑' : '↓') : ''}
                      </div>
                    </th>
                    <th onClick={() => handleUserSort('address')} style={{ cursor: 'pointer' }}>
                      <div className="sortable-header">
                        Address {userSortField === 'address' ? (userSortOrder === 'ASC' ? '↑' : '↓') : ''}
                      </div>
                    </th>
                    <th onClick={() => handleUserSort('role')} style={{ cursor: 'pointer' }}>
                      <div className="sortable-header">
                        Role {userSortField === 'role' ? (userSortOrder === 'ASC' ? '↑' : '↓') : ''}
                      </div>
                    </th>
                    <th>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {users.map((item) => (
                    <tr key={item.id}>
                      <td style={{ fontWeight: 600 }}>{item.name}</td>
                      <td>{item.email}</td>
                      <td style={{ color: 'var(--text-muted)', fontSize: '0.875rem' }}>{item.address}</td>
                      <td>
                        <span className={`badge badge-${item.role}`}>
                          {item.role === 'owner' ? 'Store Owner' : item.role}
                        </span>
                      </td>
                      <td>
                        <button className="btn btn-secondary" style={{ padding: '0.3rem 0.6rem', fontSize: '0.8rem' }} onClick={() => handleViewUserDetail(item.id)}>
                          View Details
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      )}


      {activeSubTab === 'stores' && (
        <div>
          
          <div className="actions-bar glass-panel" style={{ padding: '1rem', marginBottom: '1.5rem' }}>
            <div className="filters-wrapper">
              <input
                type="text"
                className="input-field filter-input"
                placeholder="Filter by store name..."
                value={storeFilterName}
                onChange={(e) => setStoreFilterName(e.target.value)}
              />
              <input
                type="text"
                className="input-field filter-input"
                placeholder="Filter by address..."
                value={storeFilterAddress}
                onChange={(e) => setStoreFilterAddress(e.target.value)}
              />
            </div>

            <button className="btn btn-primary" onClick={() => setShowAddStoreModal(true)}>
              + Add New Store
            </button>
          </div>

          {loadingStores && stores.length === 0 ? (
            <div style={{ textAlign: 'center', padding: '3rem' }}><div className="spinner" style={{ margin: '0 auto' }}></div></div>
          ) : stores.length === 0 ? (
            <div className="empty-state glass-panel">No stores found.</div>
          ) : (
            <div className="table-container">
              <table className="data-table">
                <thead>
                  <tr>
                    <th onClick={() => handleStoreSort('name')} style={{ cursor: 'pointer' }}>
                      <div className="sortable-header">
                        Store Name {storeSortField === 'name' ? (storeSortOrder === 'ASC' ? '↑' : '↓') : ''}
                      </div>
                    </th>
                    <th>Email</th>
                    <th onClick={() => handleStoreSort('address')} style={{ cursor: 'pointer' }}>
                      <div className="sortable-header">
                        Address {storeSortField === 'address' ? (storeSortOrder === 'ASC' ? '↑' : '↓') : ''}
                      </div>
                    </th>
                    <th>Store Owner</th>
                    <th onClick={() => handleStoreSort('overallRating')} style={{ cursor: 'pointer' }}>
                      <div className="sortable-header">
                        Rating {storeSortField === 'overallRating' ? (storeSortOrder === 'ASC' ? '↑' : '↓') : ''}
                      </div>
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {stores.map((item) => (
                    <tr key={item.id}>
                      <td style={{ fontWeight: 600 }}>{item.name}</td>
                      <td>{item.email}</td>
                      <td style={{ color: 'var(--text-muted)', fontSize: '0.875rem' }}>{item.address}</td>
                      <td>{item.owner ? item.owner.name : <span style={{ color: 'var(--text-dim)', fontStyle: 'italic' }}>Unassigned</span>}</td>
                      <td style={{ fontWeight: 'bold', color: 'var(--accent-amber)' }}>
                        ★ {item.overallRating > 0 ? item.overallRating.toFixed(1) : '0.0'} ({item.totalRatings} Reviews)
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      )}

      
      {showAddUserModal && (
        <div className="modal-overlay" onClick={() => setShowAddUserModal(false)}>
          <div className="modal-content glass-panel" onClick={(e) => e.stopPropagation()}>
            <div className="modal-header">
              <h3>Add New User</h3>
              <button className="modal-close-btn" onClick={() => setShowAddUserModal(false)}>&times;</button>
            </div>
            
            <form onSubmit={handleAddUserFormSubmit}>
              <div className="form-group">
                <label className="form-label">Full Name (Min 20, Max 60 chars)</label>
                <input
                  type="text"
                  className="input-field"
                  placeholder="e.g. Administrator Account Representative"
                  value={newUserName}
                  onChange={(e) => setNewUserName(e.target.value)}
                />
                {userFormErrors.name && <span className="error-text">{userFormErrors.name}</span>}
              </div>

              <div className="form-group">
                <label className="form-label">Email Address</label>
                <input
                  type="text"
                  className="input-field"
                  placeholder="e.g. employee@company.com"
                  value={newUserEmail}
                  onChange={(e) => setNewUserEmail(e.target.value)}
                />
                {userFormErrors.email && <span className="error-text">{userFormErrors.email}</span>}
              </div>

              <div className="form-group">
                <label className="form-label">Role</label>
                <select
                  className="filter-select"
                  style={{ width: '100%', padding: '0.75rem 1.25rem' }}
                  value={newUserRole}
                  onChange={(e) => setNewUserRole(e.target.value as any)}
                >
                  <option value="normal">Normal User</option>
                  <option value="owner">Store Owner</option>
                  <option value="admin">System Administrator</option>
                </select>
              </div>

              <div className="form-group">
                <label className="form-label">Residential Address (Max 400 chars)</label>
                <textarea
                  className="input-field"
                  style={{ minHeight: '80px', resize: 'vertical' }}
                  placeholder="e.g. 52 Main Sector Building, New Delhi..."
                  value={newUserAddress}
                  onChange={(e) => setNewUserAddress(e.target.value)}
                />
                {userFormErrors.address && <span className="error-text">{userFormErrors.address}</span>}
              </div>

              <div className="form-group">
                <label className="form-label">Password (8-16 chars, 1 uppercase, 1 special)</label>
                <input
                  type="password"
                  className="input-field"
                  placeholder="••••••••"
                  value={newUserPassword}
                  onChange={(e) => setNewUserPassword(e.target.value)}
                />
                {userFormErrors.password && <span className="error-text">{userFormErrors.password}</span>}
              </div>

              <div style={{ display: 'flex', gap: '1rem', marginTop: '2rem', justifyContent: 'flex-end' }}>
                <button type="button" className="btn btn-secondary" onClick={() => setShowAddUserModal(false)}>
                  Cancel
                </button>
                <button type="submit" className="btn btn-primary">
                  Create User
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      
      {showAddStoreModal && (
        <div className="modal-overlay" onClick={() => setShowAddStoreModal(false)}>
          <div className="modal-content glass-panel" onClick={(e) => e.stopPropagation()}>
            <div className="modal-header">
              <h3>Register New Store</h3>
              <button className="modal-close-btn" onClick={() => setShowAddStoreModal(false)}>&times;</button>
            </div>
            
            <form onSubmit={handleAddStoreSubmit}>
              <div className="form-group">
                <label className="form-label">Store Name (Min 20, Max 60 chars)</label>
                <input
                  type="text"
                  className="input-field"
                  placeholder="e.g. Delhi Organic Groceries Superstore"
                  value={newStoreName}
                  onChange={(e) => setNewStoreName(e.target.value)}
                />
                {storeFormErrors.name && <span className="error-text">{storeFormErrors.name}</span>}
              </div>

              <div className="form-group">
                <label className="form-label">Store Email Address</label>
                <input
                  type="text"
                  className="input-field"
                  placeholder="e.g. storecontact@retail.com"
                  value={newStoreEmail}
                  onChange={(e) => setNewStoreEmail(e.target.value)}
                />
                {storeFormErrors.email && <span className="error-text">{storeFormErrors.email}</span>}
              </div>

              <div className="form-group">
                <label className="form-label">Assign Store Owner (Optional)</label>
                <select
                  className="filter-select"
                  style={{ width: '100%', padding: '0.75rem 1.25rem' }}
                  value={newStoreOwnerId}
                  onChange={(e) => setNewStoreOwnerId(e.target.value)}
                >
                  <option value="">Leave Unassigned (No Owner)</option>
                  {allOwners.map((owner) => (
                    <option key={owner.id} value={owner.id}>
                      {owner.name} ({owner.email})
                    </option>
                  ))}
                </select>
              </div>

              <div className="form-group">
                <label className="form-label">Store Address (Max 400 chars)</label>
                <textarea
                  className="input-field"
                  style={{ minHeight: '80px', resize: 'vertical' }}
                  placeholder="e.g. Connaught Place Circle, Commercial Sector..."
                  value={newStoreAddress}
                  onChange={(e) => setNewStoreAddress(e.target.value)}
                />
                {storeFormErrors.address && <span className="error-text">{storeFormErrors.address}</span>}
              </div>

              <div style={{ display: 'flex', gap: '1rem', marginTop: '2rem', justifyContent: 'flex-end' }}>
                <button type="button" className="btn btn-secondary" onClick={() => setShowAddStoreModal(false)}>
                  Cancel
                </button>
                <button type="submit" className="btn btn-primary">
                  Register Store
                </button>
              </div>
            </form>
          </div>
        </div>
      )}


      {detailedUser && (
        <div className="modal-overlay" onClick={() => setDetailedUser(null)}>
          <div className="modal-content glass-panel" style={{ maxWidth: '520px' }} onClick={(e) => e.stopPropagation()}>
            <div className="modal-header">
              <h3>User Detailed Profile</h3>
              <button className="modal-close-btn" onClick={() => setDetailedUser(null)}>&times;</button>
            </div>
            
            <div style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
              <div>
                <span style={{ fontSize: '0.75rem', textTransform: 'uppercase', color: 'var(--text-dim)', fontWeight: 700 }}>Full Name</span>
                <h2 style={{ fontSize: '1.35rem', marginTop: '0.15rem' }}>{detailedUser.name}</h2>
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
                <div>
                  <span style={{ fontSize: '0.75rem', textTransform: 'uppercase', color: 'var(--text-dim)', fontWeight: 700 }}>Email Address</span>
                  <div style={{ marginTop: '0.15rem', fontWeight: 500 }}>{detailedUser.email}</div>
                </div>
                <div>
                  <span style={{ fontSize: '0.75rem', textTransform: 'uppercase', color: 'var(--text-dim)', fontWeight: 700 }}>System Role</span>
                  <div style={{ marginTop: '0.15rem' }}>
                    <span className={`badge badge-${detailedUser.role}`}>
                      {detailedUser.role === 'owner' ? 'Store Owner' : detailedUser.role}
                    </span>
                  </div>
                </div>
              </div>

              <div>
                <span style={{ fontSize: '0.75rem', textTransform: 'uppercase', color: 'var(--text-dim)', fontWeight: 700 }}>Physical Address</span>
                <p style={{ marginTop: '0.15rem', color: 'var(--text-muted)', fontSize: '0.9rem', lineHeight: '1.5' }}>
                  {detailedUser.address}
                </p>
              </div>

              {detailedUser.role === 'owner' && (
                <div style={{ marginTop: '0.5rem', padding: '1rem', background: 'rgba(255,255,255,0.02)', borderRadius: 'var(--radius-sm)', border: '1px solid var(--border-light)' }}>
                  <span style={{ fontSize: '0.75rem', textTransform: 'uppercase', color: 'var(--text-dim)', fontWeight: 700 }}>Assigned Store & Metrics</span>
                  {detailedUser.store ? (
                    <div style={{ marginTop: '0.5rem' }}>
                      <h4 style={{ fontSize: '1rem' }}>{detailedUser.store.name}</h4>
                      <p style={{ fontSize: '0.8rem', color: 'var(--text-dim)' }}>{detailedUser.store.address}</p>
                      
                      <div style={{ display: 'flex', gap: '2rem', marginTop: '0.75rem' }}>
                        <div>
                          <div style={{ fontSize: '0.7rem', color: 'var(--text-muted)' }}>Average Rating</div>
                          <div style={{ color: 'var(--accent-amber)', fontWeight: 'bold', fontSize: '1.25rem' }}>
                            ★ {detailedUser.rating}
                          </div>
                        </div>
                        <div>
                          <div style={{ fontSize: '0.7rem', color: 'var(--text-muted)' }}>Total Reviews</div>
                          <div style={{ fontWeight: 'bold', fontSize: '1.25rem', color: 'var(--text-main)' }}>
                            {detailedUser.store.totalRatings}
                          </div>
                        </div>
                      </div>
                    </div>
                  ) : (
                    <p style={{ fontStyle: 'italic', color: 'var(--text-dim)', fontSize: '0.85rem', marginTop: '0.25rem' }}>
                      This store owner has no registered store assigned yet.
                    </p>
                  )}
                </div>
              )}
            </div>

            <div style={{ display: 'flex', marginTop: '2rem', justifyContent: 'flex-end' }}>
              <button className="btn btn-secondary" onClick={() => setDetailedUser(null)}>
                Close Profile
              </button>
            </div>
          </div>
        </div>
      )}


      {showPasswordModal && (
        <div className="modal-overlay" onClick={() => setShowPasswordModal(false)}>
          <div className="modal-content glass-panel" style={{ maxWidth: '450px' }} onClick={(e) => e.stopPropagation()}>
            <div className="modal-header">
              <h3>Change Admin Password</h3>
              <button className="modal-close-btn" onClick={() => setShowPasswordModal(false)}>&times;</button>
            </div>
            
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

              <div style={{ display: 'flex', gap: '1rem', marginTop: '2rem', justifyContent: 'flex-end' }}>
                <button type="button" className="btn btn-secondary" onClick={() => setShowPasswordModal(false)} disabled={passwordLoading}>
                  Cancel
                </button>
                <button type="submit" className="btn btn-primary" disabled={passwordLoading}>
                  {passwordLoading ? 'Saving...' : 'Save Password'}
                </button>
              </div>
            </form>
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
export default AdminDashboard;
