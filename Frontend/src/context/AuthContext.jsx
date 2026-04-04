import React, { createContext, useState, useEffect, useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import { logoutUser } from '../api/auth';
import { clearCache } from '../utils/cache';

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    const userData = localStorage.getItem('userData');
    
    if (userData) {
      setUser(JSON.parse(userData));
    }
    setLoading(false);
  }, []);

  const login = (data) => {
    // Standardizing user object storage
    const userData = data.user || data;
    localStorage.setItem('userData', JSON.stringify(userData));
    
    // Save specific fields for convenience in legacy components
    if (userData.teacherName) localStorage.setItem('teacherName', userData.teacherName);
    if (userData.orgName) localStorage.setItem('organizationName', userData.orgName);
    if (userData.studentName) localStorage.setItem('studentName', userData.studentName);
    if (userData.role) localStorage.setItem('userRole', userData.role);

    setUser(userData);
  };

  const logout = async () => {
    try {
      await logoutUser();
    } catch {
      // Silent fail
    } finally {
      localStorage.clear();
      clearCache();
      setUser(null);
      navigate('/');
    }
  };

  return (
    <AuthContext.Provider value={{ user, login, logout, loading }}>
      {children}
    </AuthContext.Provider>
  );
};

export { AuthContext };

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within AuthProvider');
  }
  return context;
};