import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Input from '../components/common/Input';
import Button from '../components/common/Button';
import { useAuth } from '../hooks/useAuth';
import { useTrip } from '../hooks/useTrip';
import { createTripPlan } from '../api/tripApi';
import { validateTrip } from '../utils/validators';
import { tripPurposes, interestOptions } from '../utils/constants';

const CreateTripPage = () => {
	const { user } = useAuth();
	const { setSelectedTrip, upsertTrip } = useTrip();
	const navigate = useNavigate();

	const [form, setForm] = useState({
		origin: '',
		destination: '',
		startDate: '',
		endDate: '',
		budget: '',
		purpose: '',
		interests: [],
		notes: ''
	});
	const [errors, setErrors] = useState({});
	const [serverError, setServerError] = useState('');
	const [busy, setBusy] = useState(false);

	const handleChange = (field) => (e) => {
		const value = e.target.value;
		setForm((s) => ({ ...s, [field]: value }));
		setErrors((s) => ({ ...s, [field]: undefined }));
	};

	const toggleInterest = (interest) => {
		setForm((s) => {
			const exists = s.interests.includes(interest);
			return {
				...s,
				interests: exists
				? s.interests.filter((x) => x !== interest)
				: [...s.interests, interest]
			};
		});
	};

	const handleSubmit = async (e) => {
		e.preventDefault();
		setServerError('');
		const validationErrors = validateTrip(form);
		if (Object.keys(validationErrors).length) {
			setErrors(validationErrors);
			return;
		}
		try {
			setBusy(true);
			const payload = {
				destination: form.destination.trim(),
				origin: form.origin.trim(),
				startDate: form.startDate,
				endDate: form.endDate,
				budget: form.budget ? Number(form.budget) : undefined,
				purpose: form.purpose || undefined,
				interests: form.interests,
				notes: form.notes.trim() || undefined
			};
			const data = await createTripPlan(user.userId, payload);
			const trip = data?.data || payload;
			if (!trip.tripId && data?.data?.tripId) {
				// if backend returns tripId nested
			}
			// Try to ensure we keep ids if present
			const tripWithId = {
				...payload,
				...trip
			};
			setSelectedTrip(tripWithId);
			upsertTrip(tripWithId);
			if (tripWithId.tripId) {
				navigate(`/trip/${tripWithId.tripId}/overview`);
			} else {
				navigate('/home');
			}
		} catch (err) {
			const msg = err?.response?.data?.message || 'Failed to create trip.';
			setServerError(msg);
		} finally {
			setBusy(false);
		}
	};

	return (
		<div className="main-card">
		<h1 className="page-title">Create a new trip plan</h1>
		<p className="page-subtitle">
		Provide a few details about your trip. TripTrail will generate a day-by-day plan that you
		can fully edit later.
		</p>

		{serverError && (
			<div
			style={{
				marginBottom: '0.75rem',
				fontSize: '0.8rem',
				color: 'var(--color-danger)',
				backgroundColor: 'var(--color-danger-soft)',
				padding: '0.4rem 0.6rem',
				borderRadius: '0.75rem',
			}}
			>
			{serverError}
			</div>
		)}

		<form onSubmit={handleSubmit}>
		<div className="form-grid">
		<div>
		<Input
		label="Origin"
		id="origin"
		value={form.origin}
		onChange={handleChange('origin')}
		error={errors.origin}
		placeholder="Where are you leaving from?"
		/>
		</div>
		<div>
		<Input
		label="Destination *"
		id="destination"
		value={form.destination}
		onChange={handleChange('destination')}
		error={errors.destination}
		placeholder="City / region"
		/>
		</div>
		<div>
		<Input
		label="Start date *"
		id="startDate"
		type="date"
		value={form.startDate}
		onChange={handleChange('startDate')}
		error={errors.startDate}
		/>
		</div>
		<div>
		<Input
		label="End date *"
		id="endDate"
		type="date"
		value={form.endDate}
		onChange={handleChange('endDate')}
		error={errors.endDate}
		/>
		</div>
		<div>
		<Input
		label="Budget (total, €)"
		id="budget"
		type="number"
		value={form.budget}
		onChange={handleChange('budget')}
		error={errors.budget}
		/>
		</div>
		<div>
		<label
		htmlFor="purpose"
		style={{ display: 'block', marginBottom: '0.25rem', fontSize: '0.85rem' }}
		>
		Purpose
		</label>
		<select
		id="purpose"
		value={form.purpose}
		onChange={handleChange('purpose')}
		style={{
			width: '100%',
			padding: '0.55rem 0.75rem',
			borderRadius: '0.75rem',
			border: '1px solid var(--color-border)',
			fontSize: '0.9rem',
		}}
		>
		<option value="">Select purpose</option>
		{tripPurposes.map((p) => (
			<option key={p} value={p}>
			{p}
			</option>
		))}
		</select>
		</div>
		<div className="form-grid-full">
		<div style={{ marginBottom: '0.25rem', fontSize: '0.85rem' }}>
		Interests (optional)
		</div>
		<div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.4rem' }}>
		{interestOptions.map((interest) => {
			const active = form.interests.includes(interest);
			return (
				<button
				type="button"
				key={interest}
				onClick={() => toggleInterest(interest)}
				style={{
					borderRadius: '999px',
					padding: '0.25rem 0.7rem',
					border: 'none',
					fontSize: '0.8rem',
					cursor: 'pointer',
					background: active
					? 'var(--color-primary)'
					: 'var(--color-primary-soft)',
					color: active ? '#fff' : 'var(--color-primary-dark)'
				}}
				>
				{interest}
				</button>
			);
		})}
		</div>
		</div>
		<div className="form-grid-full">
		<Input
		label="Notes (for you or your travel partners)"
		id="notes"
		textarea
		value={form.notes}
		onChange={handleChange('notes')}
		/>
		</div>
		</div>
		<div style={{ display: 'flex', justifyContent: 'flex-end', gap: '0.75rem' }}>
		<Button
		type="button"
		variant="ghost"
		onClick={() => navigate('/home')}
		disabled={busy}
		>
		Cancel
		</Button>
		<Button type="submit" disabled={busy}>
		Generate trip plan
		</Button>
		</div>
		</form>
		</div>
	);
};

export default CreateTripPage;
