import React, { createContext, useState, useEffect } from 'react';
import { useHistory } from 'react-router-dom';
import apiClient from '../api/client';  // Add this import

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);  // Add loading state
  const history = useHistory();

  const login = async (credentials) => {
    try {
      const response = await apiClient.post('/auth/login', credentials);
      const { token, user: userData } = response.data;
      localStorage.setItem('token', token);
      setUser(userData);
      history.push('/dashboard');
    } catch (error) {
      console.error('Login failed:', error);
      // Handle error (e.g., show alert)
    }
  };

  const signup = async (credentials) => {  // Add signup function
    try {
      const response = await apiClient.post('/auth/register', credentials);
      const { token, user: userData } = response.data;
      localStorage.setItem('token', token);
      setUser(userData);
      history.push('/dashboard');
    } catch (error) {
      console.error('Signup failed:', error);
    }
  };

  const logout = () => {
    localStorage.removeItem('token');
    setUser(null);
    history.push('/login');
  };

  useEffect(() => {
    const token = localStorage.getItem('token');
    if (token) {
      // Optionally verify token with backend (e.g., /auth/me)
      setUser({ id: 1 });  // Placeholder; fetch user data if needed
    }
    setLoading(false);
  }, []);

  return (
    <AuthContext.Provider value={{ user, login, signup, logout, loading }}>
      {children}
    </AuthContext.Provider>
  );
};