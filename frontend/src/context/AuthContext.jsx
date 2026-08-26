
import { createContext, useContext, useState, useEffect } from 'react';
import api from '../api/api';

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [user,      setUser]      = useState(null);
  const [isLoading, setIsLoading] = useState(true);

  // On app start — restore previous session from localStorage
  useEffect(() => {
    try {
      const savedUser  = localStorage.getItem('homenest_user');
      const savedToken = localStorage.getItem('homenest_token');
      if (savedUser && savedToken) {
        setUser(JSON.parse(savedUser));
      }
    } catch (e) {
      localStorage.removeItem('homenest_user');
      localStorage.removeItem('homenest_token');
    } finally {
      setIsLoading(false);
    }
  }, []);

  const login = async (email, password) => {
    try {
      const response = await api.post('/api/auth/login', { email, password });
      const { token, user: userData } = response.data;

      setUser(userData);
      localStorage.setItem('homenest_user',  JSON.stringify(userData));
      localStorage.setItem('homenest_token', token);

      return userData;
    } catch (error) {
      // Backend error message or fallback
      const msg = error.response?.data?.error || 'Invalid email or password';
      throw new Error(msg);
    }
  };

  const register = async (formData, role) => {
    try {
      const response = await api.post('/api/auth/register', {
        name:     formData.name,
        email:    formData.email,
        password: formData.password,
        phone:    formData.phone,
        role:     role, // 'TENANT' or 'OWNER'
      });
      const { token, user: userData } = response.data;

      setUser(userData);
      localStorage.setItem('homenest_user',  JSON.stringify(userData));
      localStorage.setItem('homenest_token', token);

      return userData;
    } catch (error) {
      const msg = error.response?.data?.error || 'Registration failed. Please try again.';
      throw new Error(msg);
    }
  };

  const logout = () => {
    setUser(null);
    localStorage.removeItem('homenest_user');
    localStorage.removeItem('homenest_token');
    window.location.href = '/login';
  };

  const value = {
    user,
    isLoading,
    isLoggedIn: !!user,
    isAdmin:    user?.role === 'ADMIN',
    isOwner:    user?.role === 'OWNER',
    isTenant:   user?.role === 'TENANT',
    login,
    register,
    logout,
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) throw new Error('useAuth must be used inside AuthProvider');
  return context;
}
