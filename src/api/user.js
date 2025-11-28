import client from './client';

export const login = async (credentials) => {
  const response = await client.put('/user/login', credentials);
  return response.data;
};

export const signup = async (userData) => {
  const response = await client.post('/user', userData);
  return response.data;
};