import axios from 'axios';

const API_BASE_URL = process.env.REACT_APP_API_URL || 'http://localhost:3000/api';

const apiClient = axios.create({
	baseURL: API_BASE_URL,
	headers: {
		'Content-Type': 'application/json'
	}
});

apiClient.interceptors.request.use((config) => {
	const stored = localStorage.getItem('triptrail_auth');
	if (stored) {
		try {
			const { token } = JSON.parse(stored);
			if (token) {
				config.headers.Authorization = `Bearer ${token}`;
			}
		} catch {
			// ignore parse error
		}
	}
	return config;
});

apiClient.interceptors.response.use(
	(response) => response,
									(error) => {
										if (error?.response?.status === 401) {
											localStorage.removeItem('triptrail_auth');
											if (window.location.pathname !== '/login') {
												window.location.href = '/login';
											}
										}
										return Promise.reject(error);
									}
);

export default apiClient;
