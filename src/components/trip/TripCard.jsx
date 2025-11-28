import React from 'react';
import Button from '../common/Button';
import { formatDateRange } from '../../utils/date';

const TripCard = ({ trip, onOverview, onDaily }) => {
	const { destination, origin, startDate, endDate, budget, purpose } = trip;

	return (
		<div
		style={{
			background: '#fff',
			borderRadius: '1rem',
			padding: '1rem',
			boxShadow: 'var(--shadow-soft)',
			display: 'flex',
			flexDirection: 'column',
			gap: '0.5rem'
		}}
		>
		<div style={{ display: 'flex', justifyContent: 'space-between', gap: '0.5rem' }}>
		<div>
		<div style={{ fontWeight: 600 }}>{destination}</div>
		{origin && (
			<div
			style={{
				fontSize: '0.8rem',
				color: 'var(--color-text-muted)'
			}}
			>
			From {origin}
			</div>
		)}
		</div>
		<div style={{ textAlign: 'right', fontSize: '0.8rem' }}>
		<div>{formatDateRange(startDate, endDate)}</div>
		{budget != null && (
			<div style={{ color: 'var(--color-text-muted)' }}>Budget €{budget}</div>
		)}
		</div>
		</div>
		{purpose && (
			<div>
			<span className="chip">{purpose}</span>
			</div>
		)}
		<div
		style={{
			display: 'flex',
		 justifyContent: 'flex-end',
		 gap: '0.5rem',
		 marginTop: '0.5rem'
		}}
		>
		<Button variant="ghost" size="sm" onClick={onOverview}>
		Overview
		</Button>
		<Button size="sm" onClick={onDaily}>
		Daily plan
		</Button>
		</div>
		</div>
	);
};

export default TripCard;
