import React from 'react';

const Tabs = ({ items, activeKey, onChange }) => {
	return (
		<div
		style={{
			display: 'flex',
			gap: '0.5rem',
			overflowX: 'auto',
			paddingBottom: '0.25rem'
		}}
		>
		{items.map((item) => (
			<button
			key={item.key}
			onClick={() => onChange(item.key)}
			style={{
				borderRadius: '999px',
				padding: '0.35rem 0.8rem',
				border: 'none',
				cursor: 'pointer',
				fontSize: '0.8rem',
				background:
				activeKey === item.key ? 'var(--color-primary)' : 'var(--color-primary-soft)',
							  color: activeKey === item.key ? '#fff' : 'var(--color-primary-dark)'
			}}
			>
			{item.label}
			</button>
		))}
		</div>
	);
};

export default Tabs;
