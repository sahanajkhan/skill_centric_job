import React, { createContext, useState, useContext, useEffect } from 'react';
import { loginUser, registerUser, googleLoginUser, getCurrentUser } from '../services/api';

const AuthContext = createContext();

export const useAuth = () => useContext(AuthContext);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [token, setToken] = useState(localStorage.getItem('token'));
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchUser = async () => {
      if (token) {
        try {
          const res = await getCurrentUser();
          setUser(res.data.data || res.data); // Adjust based on how authController wraps response
        } catch (error) {
          console.error("Error fetching user", error);
          logout();
        }
      }
      setLoading(false);
    };

    fetchUser();
  }, [token]);

  const login = async (credentials) => {
    try {
      const res = await loginUser(credentials);
      // Assuming backend returns { success: true, data: { token, user } }
      const { token: access_token, user: userData } = res.data.data;
      localStorage.setItem('token', access_token);
      setToken(access_token);
      setUser(userData);
      return true;
    } catch (error) {
      console.error("Login failed", error);
      return false;
    }
  };

  const logout = () => {
    localStorage.removeItem('token');
    setToken(null);
    setUser(null);
  };

  const register = async (userData) => {
    try {
      const res = await registerUser(userData);
      const { token: access_token, user: newUser } = res.data.data;
      localStorage.setItem('token', access_token);
      setToken(access_token);
      setUser(newUser);
      return true;
    } catch (error) {
      console.error("Registration failed", error);
      return false;
    }
  };

  const googleLogin = async (googleToken) => {
    try {
      const res = await googleLoginUser(googleToken);
      const { token: access_token, user: userData } = res.data.data;
      localStorage.setItem('token', access_token);
      setToken(access_token);
      setUser(userData);
      return true;
    } catch (error) {
      console.error("Google login failed", error);
      return false;
    }
  };

  return (
    <AuthContext.Provider value={{ user, token, loading, login, register, googleLogin, logout }}>
      {children}
    </AuthContext.Provider>
  );
};
