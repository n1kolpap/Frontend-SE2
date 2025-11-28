import React, { createContext, useState, useContext } from 'react';
import { useHistory } from 'react-router-dom';
import client from '../api/client';

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [token, setToken] = useState(localStorage.getItem('token') || null);
  const [loading, setLoading] = useState(false);
  const history = useHistory();

  const login = async (credentials) => {
    setLoading(true);
    try {
      const response = await client.put('/user/login', credentials);  // Path: /api/user/login
      const { data } = response.data;  // Response: { success: true, data: { token, user } }
      setToken(data.token);
      setUser(data.user);
      localStorage.setItem('token', data.token);
      history.push('/home');
    } catch (error) {
      throw new Error(error.response?.data?.message || 'Login failed');
    } finally {
      setLoading(false);
    }
  };

  const signup = async (userData) => {
    setLoading(true);
    try {
      const response = await client.post('/user', userData);  // Path: /api/user
      const { data } = response.data;  // Response: { success: true, data: { token, user } }
      setToken(data.token);
      setUser(data.user);
      localStorage.setItem('token', data.token);
      history.push('/home');
    } catch (error) {
      throw new Error(error.response?.data?.message || 'Signup failed');
    } finally {
      setLoading(false);
    }
  };

  const logout = () => {
    setUser(null);
    setToken(null);
    localStorage.removeItem('token');
    history.push('/login');
  };

  return (
    <AuthContext.Provider value={{ user, token, login, signup, logout, loading }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);