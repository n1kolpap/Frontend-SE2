import React from 'react';
import { useNavigate } from 'react-router-dom';

const BottomNav = ({ active, tripId }) => {
	const navigate = useNavigate();

	if (!tripId) return null;

	return (
		<nav className="bottom-nav">
		<div
		className={`bottom-nav__item ${
			active === 'overview' ? 'bottom-nav__item--active' : ''
		}`}
		onClick={() => navigate(`/trip/${tripId}/overview`)}
		>
		<span>Overview</span>
		</div>
		<div
		className={`bottom-nav__item ${
			active === 'daily' ? 'bottom-nav__item--active' : ''
		}`}
		onClick={() => navigate(`/trip/${tripId}/daily`)}
		>
		<span>Daily plan</span>
		</div>
		</nav>
	);
};

export default BottomNav;
