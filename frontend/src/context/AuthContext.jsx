import React, { createContext, useState, useContext, useEffect } from 'react';
import { login as apiLogin, register as apiRegister, getCurrentUser } from '../services/api';

const AuthContext = createContext();

export const useAuth = () => {
  const ctx = useContext(AuthContext);
  return ctx || { user: null, token: null, loading: false, login: async () => ({ success: false }), register: async () => ({ success: false }), logout: () => {}, setUser: () => {} };
};

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [token, setToken] = useState(localStorage.getItem('token'));
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchUser = async () => {
      if (token) {
        try {
          const res = await getCurrentUser();
          if (res.success && res.data) {
            setUser(res.data);
          } else {
            logout();
          }
        } catch (error) {
          console.warn("Could not restore user session:", error.message);
          logout();
        }
      }
      setLoading(false);
    };

    fetchUser();
  }, [token]);

  const login = async (credentials) => {
    try {
      const res = await apiLogin(credentials);
      if (res.success && res.data) {
        const { token: jwtToken, user: userData } = res.data;
        localStorage.setItem('token', jwtToken);
        setToken(jwtToken);
        setUser(userData);
        return { success: true };
      }
      return { success: false, message: res.message || 'Login failed' };
    } catch (error) {
      const msg = error.response?.data?.message || error.message || 'Login failed';
      return { success: false, message: msg };
    }
  };

  const register = async (userData) => {
    try {
      const res = await apiRegister(userData);
      if (res.success && res.data) {
        const { token: jwtToken, user: newUser } = res.data;
        localStorage.setItem('token', jwtToken);
        setToken(jwtToken);
        setUser(newUser);
        return { success: true };
      }
      return { success: false, message: res.message || 'Registration failed' };
    } catch (error) {
      const msg = error.response?.data?.message || error.message || 'Registration failed';
      return { success: false, message: msg };
    }
  };

  const logout = () => {
    localStorage.removeItem('token');
    setToken(null);
    setUser(null);
  };

  return (
    <AuthContext.Provider value={{ user, token, loading, login, register, logout, setUser }}>
      {children}
    </AuthContext.Provider>
  );
};
