import React from 'react';
import { useNavigate } from 'react-router-dom';
import Button from '../components/common/Button';
import TripCard from '../components/trip/TripCard';
import { useTrip } from '../hooks/useTrip';
import { useAuth } from '../hooks/useAuth';

const HomePage = () => {
	const navigate = useNavigate();
	const { myTrips } = useTrip();
	const { user } = useAuth();

	const hasTrips = myTrips.length > 0;

	return (
		<div>
		<div
		style={{
			marginBottom: '1.5rem',
			display: 'flex',
			justifyContent: 'space-between',
			gap: '1rem',
			alignItems: 'center'
		}}
		>
		<div>
		<h1 className="page-title">Your trips</h1>
		<p className="page-subtitle">
		{hasTrips
			? 'Pick a trip to view the overview or daily plan.'
	: 'You do not have any trips yet. Create your first plan.'}
	</p>
	</div>
	<Button onClick={() => navigate('/trip/new')}>New trip plan</Button>
	</div>

	{!hasTrips ? (
		<div className="main-card">
		<div style={{ fontWeight: 600, marginBottom: '0.5rem' }}>
		Ready for your next adventure, {user?.username}?
		</div>
		<p className="page-subtitle">
		TripTrail will generate a daily plan for you based on your destination, dates, budget
		and interests. You can then fully edit the result.
		</p>
		<Button onClick={() => navigate('/trip/new')}>Create a trip plan</Button>
		</div>
	) : (
		<div style={{ display: 'grid', gap: '1rem' }}>
		{myTrips.map((trip) => (
			<TripCard
			key={trip.tripId}
			trip={trip}
			onOverview={() => navigate(`/trip/${trip.tripId}/overview`)}
			onDaily={() => navigate(`/trip/${trip.tripId}/daily`)}
			/>
		))}
		</div>
	)}
	</div>
	);
};

export default HomePage;
