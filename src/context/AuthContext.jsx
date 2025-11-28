import React, { createContext, useEffect, useState } from 'react';

export const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
	const [user, setUser] = useState(null); // { userId, username, email }
	const [token, setToken] = useState(null);
	const [loading, setLoading] = useState(true);

	useEffect(() => {
		const stored = localStorage.getItem('triptrail_auth');
		if (stored) {
			try {
				const parsed = JSON.parse(stored);
				setUser(parsed.user || null);
				setToken(parsed.token || null);
			} catch {
				// ignore
			}
		}
		setLoading(false);
	}, []);

	const handleLogin = (userPayload, tokenPayload) => {
		const authData = { user: userPayload, token: tokenPayload };
		setUser(userPayload);
		setToken(tokenPayload);
		localStorage.setItem('triptrail_auth', JSON.stringify(authData));
	};

	const handleLogout = () => {
		setUser(null);
		setToken(null);
		localStorage.removeItem('triptrail_auth');
	};

	const value = {
		user,
		token,
		isAuthenticated: !!user && !!token,
		loading,
		login: handleLogin,
		logout: handleLogout
	};

	return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};
