import { createContext, useContext, useState, useEffect } from 'react';
import api from '../utils/axios';

const AuthContext = createContext();

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [admin, setAdmin] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const initAuth = () => {
      try {
        const token = localStorage.getItem('token');
        const savedAdmin = localStorage.getItem('admin');
        const savedUser = localStorage.getItem('user');

        if (!token) {
          setLoading(false);
          return;
        }

        // Check admin first
        if (savedAdmin && savedAdmin !== 'undefined' && savedAdmin !== 'null') {
          const parsedAdmin = JSON.parse(savedAdmin);
          if (parsedAdmin && parsedAdmin.id) {
            setAdmin(parsedAdmin);
            setUser(null);
            setLoading(false);
            return;
          }
        }

        // Then check user
        if (savedUser && savedUser !== 'undefined' && savedUser !== 'null') {
          const parsedUser = JSON.parse(savedUser);
          if (parsedUser && parsedUser.id) {
            setUser(parsedUser);
            setAdmin(null);
          }
        }
      } catch (e) {
        console.error('Auth init error:', e);
        localStorage.clear();
      } finally {
        setLoading(false);
      }
    };

    initAuth();
  }, []);

  const setUserSession = (userData, token) => {
    localStorage.setItem('token', token);
    localStorage.setItem('user', JSON.stringify(userData));
    localStorage.removeItem('admin');
    setUser(userData);
    setAdmin(null);
  };

  const loginUser = async (email, password) => {
    const res = await api.post('/login', { email, password });
    setUserSession(res.data.user, res.data.token);
    return res.data;
  };

  const registerUser = async (form) => {
    const res = await api.post('/register', form);
    setUserSession(res.data.user, res.data.token);
    return res.data;
  };

  const loginAdmin = async (email, password) => {
    const res = await api.post('/admin/login', { email, password });
    localStorage.setItem('token', res.data.token);
    localStorage.setItem('admin', JSON.stringify(res.data.admin));
    localStorage.removeItem('user');
    setAdmin(res.data.admin);
    setUser(null);
    return res.data;
  };

  const logout = async () => {
    try {
      if (admin) {
        await api.post('/admin/logout');
      } else {
        await api.post('/logout');
      }
    } catch (e) {}
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    localStorage.removeItem('admin');
    setUser(null);
    setAdmin(null);
    window.location.href = '/';
  };

  return (
    <AuthContext.Provider value={{ user, admin, loginUser, registerUser, loginAdmin, logout, loading }}>
      {children}
    </AuthContext.Provider>
  );
}

export const useAuth = () => useContext(AuthContext);