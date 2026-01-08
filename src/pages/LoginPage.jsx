import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Input from '../components/common/Input';
import Button from '../components/common/Button';
import { signUp, login } from '../api/authApi';
import { useAuth } from '../hooks/useAuth';
import { validateLogin, validateSignup } from '../utils/validators';

const LoginPage = () => {
	const [mode, setMode] = useState('login'); // 'login' | 'signup'
	const [form, setForm] = useState({
		username: '',
		password: '',
		email: ''
	});
	const [errors, setErrors] = useState({});
	const [serverError, setServerError] = useState('');
	const [busy, setBusy] = useState(false);

	const { login: authLogin } = useAuth();
	const navigate = useNavigate();

	const handleChange = (field) => (e) => {
		setForm((s) => ({ ...s, [field]: e.target.value }));
		setErrors((s) => ({ ...s, [field]: undefined }));
	};

	const handleSubmit = async (e) => {
		e.preventDefault();
		setServerError('');
		try {
			setBusy(true);
			if (mode === 'login') {
				const validationErrors = validateLogin(form);
				if (Object.keys(validationErrors).length) {
					setErrors(validationErrors);
					return;
				}
				const data = await login({
					username: form.username.trim(),
					password: form.password
				});
				const user = data?.data?.user;
				const token = data?.data?.token;
				if (!user || !token) {
					setServerError('Unexpected response from server.');
					return;
				}
				authLogin(user, token);
				navigate('/home');
			} else {
				const validationErrors = validateSignup(form);
				if (Object.keys(validationErrors).length) {
					setErrors(validationErrors);
					return;
				}
				await signUp({
					username: form.username.trim(),
					password: form.password,
					email: form.email.trim()
				});
				setMode('login');
				setServerError('Account created. You can log in now.');
			}
		} catch (err) {
			const msg = err?.response?.data?.message || 'Authentication failed.';
			setServerError(msg);
		} finally {
			setBusy(false);
		}
	};

	return (
		<div className="main-card" style={{ maxWidth: 480, margin: '0 auto' }}>
		<h1 className="page-title">
		{mode === 'login' ? 'Log in to TripTrail' : 'Create your TripTrail account'}
		</h1>
		<p className="page-subtitle">
		{mode === 'login'
			? 'Enter your credentials to access your trips and daily plans.'
	: 'Sign up with a username and password. Email is optional but recommended.'}
	</p>

	<div style={{ display: 'flex', gap: '0.5rem', marginBottom: '1rem' }}>
	<button
	type="button"
	onClick={() => setMode('login')}
	style={{
		flex: 1,
		borderRadius: '999px',
		padding: '0.4rem 0.75rem',
		border: 'none',
		cursor: 'pointer',
		background:
		mode === 'login' ? 'var(--color-primary)' : 'var(--color-primary-soft)',
		color: mode === 'login' ? '#fff' : 'var(--color-primary-dark)'
	}}
	>
	Log in
	</button>
	<button
	type="button"
	onClick={() => setMode('signup')}
	style={{
		flex: 1,
		 borderRadius: '999px',
		 padding: '0.4rem 0.75rem',
		 border: 'none',
		 cursor: 'pointer',
		 background:
		 mode === 'signup' ? 'var(--color-primary)' : 'var(--color-primary-soft)',
			color: mode === 'signup' ? '#fff' : 'var(--color-primary-dark)'
	}}
	>
	Sign up
	</button>
	</div>

	{serverError && (
		<div
		style={{
			marginBottom: '0.75rem',
			fontSize: '0.8rem',
			color: serverError.includes('created') ? 'var(--color-success)' : 'var(--color-danger)',
					 backgroundColor: serverError.includes('created')
					 ? '#dcfce7'
					 : 'var(--color-danger-soft)',
					 padding: '0.4rem 0.6rem',
					 borderRadius: '0.75rem'
		}}
		>
		{serverError}
		</div>
	)}

	<form onSubmit={handleSubmit}>
	<Input
	label="Username"
	id="username"
	value={form.username}
	onChange={handleChange('username')}
	error={errors.username}
	autoComplete="username"
	/>
	{mode === 'signup' && (
		<Input
		label="Email (optional)"
		id="email"
		type="email"
		value={form.email}
		onChange={handleChange('email')}
		error={errors.email}
		autoComplete="email"
		/>
	)}
	<Input
	label="Password"
	id="password"
	type="password"
	value={form.password}
	onChange={handleChange('password')}
	error={errors.password}
	autoComplete={mode === 'login' ? 'current-password' : 'new-password'}
	/>
	<Button type="submit" fullWidth disabled={busy}>
	{mode === 'login' ? 'Log in' : 'Create account'}
	</Button>
	</form>
	</div>
	);
};

export default LoginPage;
