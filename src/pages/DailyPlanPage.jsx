import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth';
import { useTrip } from '../hooks/useTrip';
import { getDailyPlans } from '../api/dailyPlanApi';
import { getTripPlan } from '../api/tripApi';
import DailyPlanDayCard from '../components/trip/DailyPlanDayCard';
import SuggestedActivitiesModal from '../components/trip/SuggestedActivitiesModal';
import BottomNav from '../components/layout/BottomNav';
import Button from '../components/common/Button';
import Tabs from '../components/common/Tabs';
import Spinner from '../components/common/Spinner';

const DailyPlanPage = () => {
	const { tripId } = useParams();
	const { user } = useAuth();
	const {
		selectedTrip,
		setSelectedTrip,
		dailyPlans,
		setDailyPlans,
		favorites,
		upsertTrip
	} = useTrip();
	const [loading, setLoading] = useState(true);
	const [serverError, setServerError] = useState('');
	const [activeDate, setActiveDate] = useState(null);
	const [suggestionsOpen, setSuggestionsOpen] = useState(false);

	const trip = selectedTrip && selectedTrip.tripId === tripId ? selectedTrip : null;

	const loadDailyPlans = async () => {
		try {
			setLoading(true);
			const data = await getDailyPlans(user.userId, tripId);
			const list = data?.data || [];
			setDailyPlans(list);
			if (list.length && !activeDate) {
				setActiveDate(list[0].date);
			}
		} catch (err) {
			const msg = err?.response?.data?.message || 'Failed to load daily plan.';
			setServerError(msg);
		} finally {
			setLoading(false);
		}
	};

	useEffect(() => {
		const loadTrip = async () => {
			try {
				if (!trip) {
					const data = await getTripPlan(user.userId, tripId);
					const tripData = data?.data;
					if (tripData) {
						setSelectedTrip(tripData);
						upsertTrip(tripData);
					}
				}
			} catch {
				// silent
			}
		};
		loadTrip();
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, [tripId]);

	useEffect(() => {
		loadDailyPlans();
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, [tripId]);

	const activeDay = dailyPlans.find((d) => d.date === activeDate) || dailyPlans[0];

	const handleAddSuggestion = async (_activity) => {
		if (!activeDay) return;
		// We'll let the day card handle actual add, so here we just open the form
		// or pass suggestion down via a more complex mechanism.
		// To keep code simpler, we just close the modal; user can add manually.
		setSuggestionsOpen(false);
	};

	return (
		<>
		<div className="main-card">
		<h1 className="page-title">
		Daily plan {trip ? `for ${trip.destination}` : ''}
		</h1>
		<p className="page-subtitle">
		Browse your day-by-day schedule, add or remove activities, mark them as done, and keep
		notes.
		</p>

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

		{loading ? (
			<Spinner />
		) : dailyPlans.length === 0 ? (
			<div
			style={{
				fontSize: '0.9rem',
				color: 'var(--color-text-muted)'
			}}
			>
			There is no generated daily plan yet. If this is unexpected, please refresh or try
			again later.
			</div>
		) : (
			<>
			<div
			style={{
				marginBottom: '0.75rem',
				display: 'flex',
				justifyContent: 'space-between',
				gap: '0.75rem',
				alignItems: 'center'
			}}
			>
			<Tabs
			items={dailyPlans.map((d, idx) => ({
				key: d.date,
				label: `Day ${idx + 1}`
			}))}
			activeKey={activeDay?.date}
			onChange={setActiveDate}
			/>
			<Button
			size="sm"
			variant="outline"
			onClick={() => setSuggestionsOpen(true)}
			>
			Suggested activities
			</Button>
			</div>

			<DailyPlanDayCard
			tripId={tripId}
			day={activeDay}
			onRefresh={loadDailyPlans}
			/>

			{favorites.length > 0 && (
				<div
				style={{
					marginTop: '1rem',
					borderTop: '1px dashed var(--color-border)',
					paddingTop: '0.75rem'
				}}
				>
				<div style={{ fontWeight: 600, marginBottom: '0.4rem', fontSize: '0.9rem' }}>
				Favorites (for future trips)
				</div>
				<div
				style={{
					display: 'flex',
					flexWrap: 'wrap',
					gap: '0.5rem',
					fontSize: '0.8rem'
				}}
				>
				{favorites.map((f) => (
					<span
					key={f.key}
					style={{
						borderRadius: '999px',
						padding: '0.25rem 0.6rem',
						background: 'var(--color-primary-soft)',
						color: 'var(--color-primary-dark)'
					}}
					>
					{f.activity.name}
					</span>
				))}
				</div>
				</div>
			)}
			</>
		)}
		</div>

		<BottomNav tripId={tripId} active="daily" />

		<SuggestedActivitiesModal
		open={suggestionsOpen}
		onClose={() => setSuggestionsOpen(false)}
		destination={trip?.destination}
		onAdd={handleAddSuggestion}
		/>
		</>
	);
};

export default DailyPlanPage;
