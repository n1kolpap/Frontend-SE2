import React from 'react';

const Card = ({ children, clickable = false, onClick, style }) => {
	return (
		<div
		className="card"
		onClick={onClick}
		style={{
			background: 'var(--color-bg-alt)',
			borderRadius: '1rem',
			padding: '1rem',
			boxShadow: 'var(--shadow-soft)',
			cursor: clickable ? 'pointer' : 'default',
			...style
		}}
		>
		{children}
		</div>
	);
};

export default Card;
