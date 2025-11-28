import apiClient from './client';

export const signUp = async (payload) => {
	const res = await apiClient.post('/user', payload);
	return res.data;
};

export const login = async (payload) => {
	const res = await apiClient.put('/user/login', payload);
	return res.data;
};
