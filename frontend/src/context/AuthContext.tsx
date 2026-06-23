import React, { createContext, useState, useEffect, useContext } from 'react';

interface User {
  id: number;
  name: string;
  email: string;
  role: 'admin' | 'normal' | 'owner';
  address: string;
}

interface AuthContextType {
  user: User | null;
  token: string | null;
  login: (token: string, user: User) => void;
  logout: () => void;
  isAuthenticated: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [token, setToken] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const storedToken = localStorage.getItem('store_rating_token');
    const storedUser = localStorage.getItem('store_rating_user');
    
    if (storedToken && storedUser) {
      try {
        setToken(storedToken);
        setUser(JSON.parse(storedUser));
      } catch (e) {
        console.error('Failed to parse cached user data:', e);
        localStorage.removeItem('store_rating_token');
        localStorage.removeItem('store_rating_user');
      }
    }
    setLoading(false);
  }, []);

  const login = (newToken: string, newUser: User) => {
    setToken(newToken);
    setUser(newUser);
    localStorage.setItem('store_rating_token', newToken);
    localStorage.setItem('store_rating_user', JSON.stringify(newUser));
  };

  const logout = () => {
    setToken(null);
    setUser(null);
    localStorage.removeItem('store_rating_token');
    localStorage.removeItem('store_rating_user');
  };

  const value = {
    user,
    token,
    login,
    logout,
    isAuthenticated: !!token,
  };

  if (loading) {
    return (
      <div style={{
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        height: '100vh',
        background: '#0f172a',
        color: '#f8fafc',
        fontFamily: 'system-ui'
      }}>
        <div className="spinner">Loading Platform...</div>
      </div>
    );
  }

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
