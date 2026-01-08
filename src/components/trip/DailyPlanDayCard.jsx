import React, { useState } from 'react';
import Button from '../common/Button';
import Input from '../common/Input';
import Modal from '../common/Modal';
import { useAuth } from '../../hooks/useAuth';
import { useTrip } from '../../hooks/useTrip';
import {
	addActivity,
	deleteActivity,
	markActivityCompleted,
	addDailyNote
} from '../../api/dailyPlanApi';
import { formatDayLabel } from '../../utils/date';

const DailyPlanDayCard = ({ tripId, day, onRefresh }) => {
	const { user } = useAuth();
	const { toggleFavorite } = useTrip();
	const [showAddForm, setShowAddForm] = useState(false);
	const [newActivity, setNewActivity] = useState({
		name: '',
		time: '',
		location: '',
		notes: ''
	});
	const [note, setNote] = useState(day.notes || '');
	const [deleteTarget, setDeleteTarget] = useState(null);
	const [busy, setBusy] = useState(false);

	const handleAddActivity = async (e) => {
		e.preventDefault();
		if (!newActivity.name || !newActivity.time) return;
		try {
			setBusy(true);
			await addActivity(user.userId, tripId, day.date, newActivity);
			setNewActivity({ name: '', time: '', location: '', notes: '' });
			setShowAddForm(false);
			onRefresh();
		} finally {
			setBusy(false);
		}
	};

	const handleDeleteActivity = async () => {
		if (!deleteTarget) return;
		try {
			setBusy(true);
			await deleteActivity(user.userId, tripId, day.date, deleteTarget.activityId);
			setDeleteTarget(null);
			onRefresh();
		} finally {
			setBusy(false);
		}
	};

	const handleToggleCompleted = async (activity) => {
		try {
			setBusy(true);
			await markActivityCompleted(user.userId, tripId, day.date, activity.activityId);
			onRefresh();
		} finally {
			setBusy(false);
		}
	};

	const handleSaveNote = async () => {
		try {
			setBusy(true);
			await addDailyNote(user.userId, tripId, day.date, note);
			onRefresh();
		} finally {
			setBusy(false);
		}
	};

	return (
		<div
		style={{
			background: '#fff',
			borderRadius: '1rem',
			padding: '1rem',
			boxShadow: 'var(--shadow-soft)',
			marginBottom: '1rem'
		}}
		>
		<div
		style={{
			display: 'flex',
			justifyContent: 'space-between',
			marginBottom: '0.75rem',
			alignItems: 'center'
		}}
		>
		<div style={{ fontWeight: 600 }}>{formatDayLabel(day.date)}</div>
		<Button size="sm" variant="outline" onClick={() => setShowAddForm((s) => !s)}>
		{showAddForm ? 'Close form' : 'Add activity'}
		</Button>
		</div>

		{day.activities?.length ? (
			<div style={{ display: 'flex', flexDirection: 'column', gap: '0.4rem' }}>
			{day.activities.map((activity) => (
				<div
				key={activity.activityId}
				style={{
					display: 'flex',
					justifyContent: 'space-between',
					gap: '0.5rem',
					padding: '0.5rem 0.4rem',
					borderBottom: '1px dashed var(--color-border)',
					alignItems: 'center'
				}}
				>
				<div style={{ flex: 1 }}>
				<div style={{ fontSize: '0.8rem', color: 'var(--color-text-muted)' }}>
				{activity.time || '--:--'}
				</div>
				<div
				style={{
					fontWeight: 500,
					textDecoration: activity.completed ? 'line-through' : 'none'
				}}
				>
				{activity.name}
				</div>
				{activity.location && (
					<div style={{ fontSize: '0.75rem', color: 'var(--color-text-muted)' }}>
					{activity.location}
					</div>
				)}
				{activity.notes && (
					<div style={{ fontSize: '0.75rem', marginTop: 2 }}>{activity.notes}</div>
				)}
				</div>
				<div
				style={{
					display: 'flex',
					flexDirection: 'column',
					gap: '0.25rem',
					alignItems: 'flex-end'
				}}
				>
				<button
				title="Toggle favorite"
				onClick={() => toggleFavorite(tripId, day.date, activity)}
				style={{
					border: 'none',
					background: 'transparent',
					cursor: 'pointer',
					fontSize: '1rem'
				}}
				>
				☆
				</button>
				<button
				onClick={() => handleToggleCompleted(activity)}
				style={{
					borderRadius: '999px',
					border: 'none',
					padding: '0.25rem 0.6rem',
					fontSize: '0.7rem',
					cursor: 'pointer',
					background: activity.completed ? '#dcfce7' : '#e5e7eb'
				}}
				>
				{activity.completed ? 'Done' : 'Mark done'}
				</button>
				<button
				onClick={() => setDeleteTarget(activity)}
				style={{
					border: 'none',
					background: 'transparent',
					color: 'var(--color-danger)',
					fontSize: '0.75rem',
					cursor: 'pointer'
				}}
				>
				Delete
				</button>
				</div>
				</div>
			))}
			</div>
		) : (
			<div
			style={{
				fontSize: '0.85rem',
				color: 'var(--color-text-muted)',
				marginBottom: '0.75rem'
			}}
			>
			No activities planned yet. Start by adding one.
			</div>
		)}

		{showAddForm && (
			<form onSubmit={handleAddActivity} style={{ marginTop: '0.75rem' }}>
			<Input
			label="Activity name"
			value={newActivity.name}
			onChange={(e) => setNewActivity((s) => ({ ...s, name: e.target.value }))}
			required
			/>
			<div className="form-grid">
			<div>
			<Input
			label="Time"
			type="time"
			value={newActivity.time}
			onChange={(e) => setNewActivity((s) => ({ ...s, time: e.target.value }))}
			required
			/>
			</div>
			<div>
			<Input
			label="Location"
			value={newActivity.location}
			onChange={(e) => setNewActivity((s) => ({ ...s, location: e.target.value }))}
			/>
			</div>
			</div>
			<Input
			label="Notes"
			textarea
			value={newActivity.notes}
			onChange={(e) => setNewActivity((s) => ({ ...s, notes: e.target.value }))}
			/>
			<Button type="submit" disabled={busy}>
			Save activity
			</Button>
			</form>
		)}

		<div style={{ marginTop: '1rem' }}>
		<Input
		label="Day notes"
		textarea
		value={note}
		onChange={(e) => setNote(e.target.value)}
		/>
		<Button
		type="button"
		variant="outline"
		size="sm"
		onClick={handleSaveNote}
		disabled={busy}
		>
		Save notes
		</Button>
		</div>

		<Modal
		open={!!deleteTarget}
		title="Delete activity"
		onClose={() => setDeleteTarget(null)}
		actions={
			<Button
			variant="danger"
			size="sm"
			onClick={handleDeleteActivity}
			disabled={busy}
			>
			Delete
			</Button>
		}
		>
		Are you sure you want to delete &ldquo;{deleteTarget?.name}&rdquo; from this day?
		</Modal>
		</div>
	);
};

export default DailyPlanDayCard;
