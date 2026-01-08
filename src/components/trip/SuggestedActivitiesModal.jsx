import React from 'react';
import Modal from '../common/Modal';
import Button from '../common/Button';

const SuggestedActivitiesModal = ({ open, onClose, destination, onAdd }) => {
	const base = (destination || '').toLowerCase();
	const city = destination || 'your destination';

	const suggestions =
	base.includes('barcelona') || base.includes('spain')
	? [
		{ name: 'Sagrada Familia visit', time: '10:00', location: 'Sagrada Familia' },
		{ name: 'Tapas in El Born', time: '19:30', location: 'El Born' },
		{ name: 'Stroll in Park Güell', time: '17:00', location: 'Park Güell' }
	]
	: [
		{ name: `City walking tour in ${city}`, time: '10:00', location: city },
		{ name: 'Local food tasting', time: '13:00', location: 'Old town' },
		{ name: 'Sunset viewpoint', time: '18:30', location: 'Scenic spot' }
	];

	return (
		<Modal
		open={open}
		onClose={onClose}
		title="Suggested activities"
		actions={<></>}
		>
		<div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
		{suggestions.map((s, idx) => (
			<div
			key={idx}
			style={{
				borderRadius: '0.75rem',
				border: '1px dashed var(--color-border)',
				padding: '0.6rem 0.75rem',
				display: 'flex',
				justifyContent: 'space-between',
				gap: '0.5rem',
				alignItems: 'center'
			}}
			>
			<div>
			<div style={{ fontWeight: 500 }}>{s.name}</div>
			<div style={{ fontSize: '0.8rem', color: 'var(--color-text-muted)' }}>
			{s.time} · {s.location}
			</div>
			</div>
			<Button
			size="sm"
			variant="outline"
			onClick={() => onAdd(s)}
			>
			Add
			</Button>
			</div>
		))}
		</div>
		</Modal>
	);
};

export default SuggestedActivitiesModal;
