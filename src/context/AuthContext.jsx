import React, { createContext, useState, useEffect } from 'react';
import { useHistory } from 'react-router-dom';

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const history = useHistory();

  const login = (credentials) => {
    setUser({ id: 1, email: credentials.email });
    history.push('/dashboard');
  };

  const logout = () => {
    setUser(null);
    history.push('/login');
  };

  useEffect(() => {
    const token = localStorage.getItem('token');
    if (token) {
      setUser({ id: 1 });
    }
  }, []);

  return (
    <AuthContext.Provider value={{ user, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};