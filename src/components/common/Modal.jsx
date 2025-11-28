import React from 'react';
import Button from './Button';

const Modal = ({ open, title, children, onClose, actions }) => {
	if (!open) return null;
	return (
		<div
		style={{
			position: 'fixed',
			inset: 0,
			background: 'rgba(15,23,42,0.35)',
			display: 'flex',
			alignItems: 'center',
			justifyContent: 'center',
			zIndex: 50
		}}
		>
		<div
		style={{
			background: '#fff',
		 borderRadius: '1rem',
		 padding: '1.5rem',
		 width: '100%',
		 maxWidth: 420,
		 boxShadow: 'var(--shadow-card)'
		}}
		>
		{title && <h3 style={{ marginTop: 0, marginBottom: '0.75rem' }}>{title}</h3>}
		<div style={{ marginBottom: '1.25rem' }}>{children}</div>
		<div
		style={{
			display: 'flex',
		 justifyContent: 'flex-end',
		 gap: '0.5rem'
		}}
		>
		<Button variant="ghost" size="sm" onClick={onClose}>
		Cancel
		</Button>
		{actions}
		</div>
		</div>
		</div>
	);
};

export default Modal;
