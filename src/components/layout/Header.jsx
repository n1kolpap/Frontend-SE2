import React from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import Button from '../common/Button';
import { useAuth } from '../../hooks/useAuth';

const Header = () => {
	const { user, isAuthenticated, logout } = useAuth();
	const navigate = useNavigate();
	const location = useLocation();

	const showCta = location.pathname === '/';

	return (
		<header className="app-header">
		<div
		className="app-header__brand"
		onClick={() => navigate(isAuthenticated ? '/home' : '/')}
		style={{ cursor: 'pointer' }}
		>
		<div className="app-header__logo" />
		<span>TripTrail</span>
		</div>
		<div className="app-header__user">
		{isAuthenticated && user ? (
			<>
			<span style={{ fontSize: '0.85rem' }}>Hi, {user.username}</span>
			<Button variant="ghost-light" size="sm" onClick={logout}>
			Log out
			</Button>
			</>
		) : showCta ? (
			<Button size="sm" onClick={() => navigate('/login')}>
			Log in
			</Button>
		) : null}
		</div>
		</header>
	);
};

export default Header;
