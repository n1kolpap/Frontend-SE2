import React from 'react';
import { useNavigate } from 'react-router-dom';
import Button from '../components/common/Button';

const WelcomePage = () => {
	const navigate = useNavigate();

	return (
		<div className="main-card main-card--hero">
		<div>
		<div
		style={{
			fontSize: '2rem',
			fontWeight: 800,
			marginBottom: '0.75rem'
		}}
		>
		Unlock the world with <span style={{ color: 'var(--color-primary)' }}>TripTrail</span>
		</div>
		<p className="page-subtitle">
		Generate smart daily plans from simple inputs. Tweak, rearrange, and truly own your
		trip.
		</p>
		<div style={{ display: 'flex', gap: '0.75rem', marginBottom: '1rem', flexWrap: 'wrap' }}>
		<Button size="lg" onClick={() => navigate('/login')}>
		Get started
		</Button>
		<Button size="lg" variant="outline" onClick={() => navigate('/login')}>
		I already have an account
		</Button>
		</div>
		<div style={{ fontSize: '0.8rem', color: 'var(--color-text-muted)' }}>
		No credit card, no hassle. Just log in, describe your trip, and TripTrail generates a
		draft plan that you can fully edit.
		</div>
		</div>
		<div className="main-card__hero-graphic">
		<div className="main-card__hero-badge">Plan smarter</div>
		<div className="main-card__hero-map" />
		<div className="main-card__hero-plane">
		<span>Next trip: crafted in minutes</span>
		</div>
		</div>
		</div>
	);
};

export default WelcomePage;
