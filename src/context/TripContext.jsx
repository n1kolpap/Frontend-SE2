import React, { createContext, useState } from 'react';

export const TripContext = createContext(null);

/**
 * TripContext keeps:
 * - myTrips: in-memory list of trips for HomePage
 * - selectedTrip: currently active trip
 * - dailyPlans: array of daily plan objects
 * - favorites: list of favorite activities
 */
export const TripProvider = ({ children }) => {
	const [myTrips, setMyTrips] = useState([]);
	const [selectedTrip, setSelectedTrip] = useState(null);
	const [dailyPlans, setDailyPlans] = useState([]);
	const [favorites, setFavorites] = useState([]);

	const upsertTrip = (trip) => {
		if (!trip?.tripId) {
			return;
		}
		setMyTrips((prev) => {
			const exists = prev.some((t) => t.tripId === trip.tripId);
			if (exists) {
				return prev.map((t) => (t.tripId === trip.tripId ? { ...t, ...trip } : t));
			}
			return [...prev, trip];
		});
	};

	const removeTrip = (tripId) => {
		setMyTrips((prev) => prev.filter((t) => t.tripId !== tripId));
		if (selectedTrip?.tripId === tripId) {
			setSelectedTrip(null);
		}
	};

	const toggleFavorite = (tripId, date, activity) => {
		const key = `${tripId}-${date}-${activity.activityId}`;
		setFavorites((prev) => {
			const exists = prev.find((f) => f.key === key);
			if (exists) {
				return prev.filter((f) => f.key !== key);
			}
			return [...prev, { key, tripId, date, activity }];
		});
	};

	return (
		<TripContext.Provider
		value={{
			myTrips,
			selectedTrip,
			dailyPlans,
			favorites,
			setSelectedTrip,
			setDailyPlans,
			upsertTrip,
			removeTrip,
			toggleFavorite
		}}
		>
		{children}
		</TripContext.Provider>
	);
};
