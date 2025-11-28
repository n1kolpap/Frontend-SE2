import React from 'react';

const Input = ({
	label,
	type = 'text',
	id,
	error,
	helperText,
	textarea = false,
	...rest
}) => {
	const InputElement = textarea ? 'textarea' : 'input';

	return (
		<div style={{ marginBottom: '0.85rem' }}>
		{label && (
			<label
			htmlFor={id}
			style={{ display: 'block', marginBottom: '0.25rem', fontSize: '0.85rem' }}
			>
			{label}
			</label>
		)}
		<InputElement
		id={id}
		type={type}
		rows={textarea ? 3 : undefined}
		style={{
			width: '100%',
			padding: '0.55rem 0.75rem',
			borderRadius: '0.75rem',
			border: `1px solid ${error ? 'var(--color-danger)' : 'var(--color-border)'}`,
			outline: 'none',
			fontSize: '0.9rem'
		}}
		{...rest}
		/>
		{helperText && !error && (
			<div style={{ fontSize: '0.75rem', color: 'var(--color-text-muted)', marginTop: 2 }}>
			{helperText}
			</div>
		)}
		{error && (
			<div style={{ fontSize: '0.75rem', color: 'var(--color-danger)', marginTop: 2 }}>
			{error}
			</div>
		)}
		</div>
	);
};

export default Input;
