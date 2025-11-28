import React, { createContext, useState } from 'react';

export const TripContext = createContext();

export const TripProvider = ({ children }) => {
  const [trips, setTrips] = useState([]);
  const [currentTrip, setCurrentTrip] = useState(null);

  const createTrip = (tripData) => {
    const newTrip = { id: Date.now(), ...tripData, dailyPlan: [] };
    setTrips([...trips, newTrip]);
    setCurrentTrip(newTrip);
    return newTrip.id;
  };

  const updateTrip = (tripId, tripData) => {
    setTrips(trips.map(t => t.id === tripId ? { ...t, ...tripData } : t));
  };

  const addActivity = (tripId, date, activity) => {
    setTrips(trips.map(t => t.id === tripId ? {
      ...t,
      dailyPlan: t.dailyPlan.map(d => d.date === date ? { ...d, activities: [...d.activities, { ...activity, id: Date.now() }] } : d)
    } : t));
  };

  const deleteActivity = (tripId, date, activityId) => {
    setTrips(trips.map(t => t.id === tripId ? {
      ...t,
      dailyPlan: t.dailyPlan.map(d => d.date === date ? { ...d, activities: d.activities.filter(a => a.id !== activityId) } : d)
    } : t));
  };

  return (
    <TripContext.Provider value={{ trips, currentTrip, createTrip, updateTrip, addActivity, deleteActivity, setCurrentTrip }}>
      {children}
    </TripContext.Provider>
  );
};