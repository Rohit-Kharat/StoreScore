import React from 'react';
import { useAuth } from '../context/AuthContext';

export const Navbar: React.FC = () => {
  const { user, logout } = useAuth();

  if (!user) return null;

  const getRoleBadgeClass = (role: string) => {
    switch (role) {
      case 'admin': return 'badge badge-admin';
      case 'owner': return 'badge badge-owner';
      default: return 'badge badge-normal';
    }
  };

  return (
    <nav className="navbar">
      <div className="nav-brand">
        <span className="gradient-text" style={{ fontSize: '1.6rem', fontWeight: 800 }}>TrustStore</span>
      </div>

      <div className="nav-user">
        <div className="nav-user-details">
          <div className="nav-username" title={user.name}>{user.name}</div>
          <div className={getRoleBadgeClass(user.role)}>{user.role === 'owner' ? 'Store Owner' : user.role}</div>
        </div>
        
        <button onClick={logout} className="btn btn-secondary" style={{ padding: '0.4rem 1rem', fontSize: '0.85rem' }}>
          Sign Out
        </button>
      </div>
    </nav>
  );
};
