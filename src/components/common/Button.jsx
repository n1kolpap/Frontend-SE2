import React from 'react';

const Button = ({
	children,
	variant = 'primary',
	size = 'md',
	fullWidth = false,
	...rest
}) => {
	const base =
	'border-none cursor-pointer rounded-full font-medium inline-flex items-center justify-center transition-all duration-150';
	const variants = {
		primary:
		'bg-[var(--color-primary)] text-white hover:bg-[var(--color-primary-dark)] shadow-md',
		outline:
		'bg-white text-[var(--color-primary)] border border-[var(--color-primary-soft)] hover:bg-[var(--color-primary-soft)]',
		ghost:
		'bg-transparent text-[var(--color-text)] hover:bg-[var(--color-primary-soft)]',
		'ghost-light':
		'bg-transparent text-white hover:bg-[rgba(255,255,255,0.15)] border border-[rgba(255,255,255,0.25)]',
		danger:
		'bg-[var(--color-danger)] text-white hover:bg-red-600 shadow-md'
	};
	const sizes = {
		sm: 'text-xs px-3 py-1.5',
		md: 'text-sm px-4 py-2',
		lg: 'text-sm px-5 py-2.5'
	};

	const className = [
		base,
		variants[variant] || variants.primary,
		sizes[size] || sizes.md,
		fullWidth ? 'w-full' : ''
	]
	.filter(Boolean)
	.join(' ');

	return (
		<button className={className} {...rest}>
		{children}
		</button>
	);
};

export default Button;
