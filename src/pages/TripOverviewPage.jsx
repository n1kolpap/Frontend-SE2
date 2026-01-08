import React, { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import Input from '../components/common/Input';
import Button from '../components/common/Button';
import Modal from '../components/common/Modal';
import BottomNav from '../components/layout/BottomNav';
import { useAuth } from '../hooks/useAuth';
import { useTrip } from '../hooks/useTrip';
import { getTripPlan, updateTripPlan, deleteTripPlan } from '../api/tripApi';
import { validateTripUpdate } from '../utils/validators';
import { formatDateRange } from '../utils/date';

const TripOverviewPage = () => {
	const { tripId } = useParams();
	const navigate = useNavigate();
	const { user } = useAuth();
	const { selectedTrip, setSelectedTrip, upsertTrip, removeTrip } = useTrip();

	const [form, setForm] = useState({
		origin: '',
		destination: '',
		startDate: '',
		endDate: '',
		budget: '',
		purpose: '',
		notes: ''
	});
	const [editMode, setEditMode] = useState(false);
	const [errors, setErrors] = useState({});
	const [serverError, setServerError] = useState('');
	const [loading, setLoading] = useState(true);
	const [busy, setBusy] = useState(false);
	const [deleteOpen, setDeleteOpen] = useState(false);

	const trip = selectedTrip && selectedTrip.tripId === tripId ? selectedTrip : null;

	useEffect(() => {
		const load = async () => {
			try {
				setLoading(true);
				if (!trip) {
					const data = await getTripPlan(user.userId, tripId);
					const tripData = data?.data;
					if (tripData) {
						setSelectedTrip(tripData);
						upsertTrip(tripData);
					}
				}
			} catch (err) {
				const msg = err?.response?.data?.message || 'Failed to load trip.';
				setServerError(msg);
			} finally {
				setLoading(false);
			}
		};
		load();
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, [tripId]);

	useEffect(() => {
		if (trip) {
			setForm({
				origin: trip.origin || '',
				destination: trip.destination || '',
				startDate: trip.startDate || '',
				endDate: trip.endDate || '',
				budget: trip.budget != null ? String(trip.budget) : '',
					purpose: trip.purpose || '',
					notes: trip.notes || ''
			});
		}
	}, [trip]);

	const handleChange = (field) => (e) => {
		const value = e.target.value;
		setForm((s) => ({ ...s, [field]: value }));
		setErrors((s) => ({ ...s, [field]: undefined }));
	};

	const handleSave = async () => {
		setServerError('');
		const validationErrors = validateTripUpdate(form);
		if (Object.keys(validationErrors).length) {
			setErrors(validationErrors);
			return;
		}
		try {
			setBusy(true);
			const payload = {
				destination: form.destination.trim() || undefined,
				origin: form.origin.trim() || undefined,
				startDate: form.startDate || undefined,
				endDate: form.endDate || undefined,
				budget: form.budget ? Number(form.budget) : undefined,
				purpose: form.purpose || undefined,
				notes: form.notes.trim() || undefined
			};
			await updateTripPlan(user.userId, tripId, payload);
			const updated = { ...(trip || {}), ...payload };
			setSelectedTrip(updated);
			upsertTrip(updated);
			setEditMode(false);
		} catch (err) {
			const msg = err?.response?.data?.message || 'Failed to update trip.';
			setServerError(msg);
		} finally {
			setBusy(false);
		}
	};

	const handleDelete = async () => {
		try {
			setBusy(true);
			await deleteTripPlan(user.userId, tripId);
			removeTrip(tripId);
			setDeleteOpen(false);
			navigate('/home');
		} catch (err) {
			const msg = err?.response?.data?.message || 'Failed to delete trip.';
			setServerError(msg);
		} finally {
			setBusy(false);
		}
	};

	if (loading) {
		return <div>Loading trip...</div>;
	}

	if (!trip) {
		return <div>Trip not found.</div>;
	}

	return (
		<>
		<div className="main-card">
		<div
		style={{
			display: 'flex',
			justifyContent: 'space-between',
			gap: '1rem',
			marginBottom: '1rem',
			alignItems: 'center'
		}}
		>
		<div>
		<h1 className="page-title">{trip.destination}</h1>
		<div style={{ fontSize: '0.9rem', color: 'var(--color-text-muted)' }}>
		{formatDateRange(trip.startDate, trip.endDate)}
		</div>
		</div>
		<div style={{ display: 'flex', flexDirection: 'column', gap: '0.4rem' }}>
		{!editMode ? (
			<Button size="sm" variant="outline" onClick={() => setEditMode(true)}>
			Edit trip
			</Button>
		) : (
			<div style={{ display: 'flex', gap: '0.5rem' }}>
			<Button
			size="sm"
			variant="ghost"
			onClick={() => {
				setEditMode(false);
				setErrors({});
				if (trip) {
					setForm({
						origin: trip.origin || '',
						destination: trip.destination || '',
						startDate: trip.startDate || '',
						endDate: trip.endDate || '',
						budget: trip.budget != null ? String(trip.budget) : '',
							purpose: trip.purpose || '',
							notes: trip.notes || ''
					});
				}
			}}
			>
			Cancel
			</Button>
			<Button size="sm" onClick={handleSave} disabled={busy}>
			Save
			</Button>
			</div>
		)}
		<Button
		size="sm"
		variant="danger"
		onClick={() => setDeleteOpen(true)}
		disabled={busy}
		>
		Delete trip
		</Button>
		</div>
		</div>

		{serverError && (
			<div
			style={{
				marginBottom: '0.75rem',
				fontSize: '0.8rem',
				color: 'var(--color-danger)',
				backgroundColor: 'var(--color-danger-soft)',
				padding: '0.4rem 0.6rem',
				borderRadius: '0.75rem'
			}}
			>
			{serverError}
			</div>
		)}

		<div className="form-grid">
		<div>
		<Input
		label="Origin"
		value={form.origin}
		onChange={handleChange('origin')}
		error={errors.origin}
		disabled={!editMode}
		/>
		</div>
		<div>
		<Input
		label="Destination"
		value={form.destination}
		onChange={handleChange('destination')}
		error={errors.destination}
		disabled={!editMode}
		/>
		</div>
		<div>
		<Input
		label="Start date"
		type="date"
		value={form.startDate}
		onChange={handleChange('startDate')}
		error={errors.startDate}
		disabled={!editMode}
		/>
		</div>
		<div>
		<Input
		label="End date"
		type="date"
		value={form.endDate}
		onChange={handleChange('endDate')}
		error={errors.endDate}
		disabled={!editMode}
		/>
		</div>
		<div>
		<Input
		label="Budget (total, €)"
		type="number"
		value={form.budget}
		onChange={handleChange('budget')}
		error={errors.budget}
		disabled={!editMode}
		/>
		</div>
		<div>
		<Input
		label="Purpose"
		value={form.purpose}
		onChange={handleChange('purpose')}
		disabled={!editMode}
		/>
		</div>
		<div className="form-grid-full">
		<Input
		label="Notes"
		textarea
		value={form.notes}
		onChange={handleChange('notes')}
		disabled={!editMode}
		/>
		</div>
		</div>

		<div style={{ marginTop: '1.5rem', display: 'flex', justifyContent: 'flex-end' }}>
		<Button variant="outline" onClick={() => navigate(`/trip/${tripId}/daily`)}>
		View daily plan
		</Button>
		</div>
		</div>

		<BottomNav tripId={tripId} active="overview" />

		<Modal
		open={deleteOpen}
		onClose={() => setDeleteOpen(false)}
		title="Delete this trip?"
		actions={
			<Button
			variant="danger"
			size="sm"
			onClick={handleDelete}
			disabled={busy}
			>
			Delete
			</Button>
		}
		>
		This will permanently remove the trip plan and all associated daily plans. This action
		cannot be undone.
		</Modal>
		</>
	);
};

export default TripOverviewPage;
