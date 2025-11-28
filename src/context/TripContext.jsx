import React, { createContext, useContext, useState, useEffect } from 'react';
import { useAuth } from './AuthContext';
import client from '../api/client';

const TripContext = createContext();

export const TripProvider = ({ children }) => {
  const { user } = useAuth();
  const [trips, setTrips] = useState([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (user) fetchTrips();
  }, [user]);

  const fetchTrips = async () => {
    setLoading(true);
    try {
      const response = await client.get(`/user/${user.id}/tripPlan`);  // Path: /api/user/:userId/tripPlan
      setTrips(response.data.data || []);  // Response: { success: true, data: [...] }
    } catch (error) {
      console.error('Failed to fetch trips');
    } finally {
      setLoading(false);
    }
  };

  const addTrip = async (tripData) => {
    try {
      const response = await client.post(`/user/${user.id}/tripPlan`, tripData);  // Path: /api/user/:userId/tripPlan
      const newTrip = response.data.data;  // Response: { success: true, data: trip }
      setTrips([...trips, newTrip]);
    } catch (error) {
      console.error('Failed to add trip');
    }
  };

  const updateTrip = async (tripId, updates) => {
    try {
      const response = await client.put(`/user/${user.id}/tripPlan/${tripId}`, updates);  // Path: /api/user/:userId/tripPlan/:tripId
      setTrips(trips.map(t => t.id === tripId ? response.data.data : t));  // Response: { success: true, data: trip }
    } catch (error) {
      console.error('Failed to update trip');
    }
  };

  const deleteTrip = async (tripId) => {
    try {
      await client.delete(`/user/${user.id}/tripPlan/${tripId}`);  // Path: /api/user/:userId/tripPlan/:tripId
      setTrips(trips.filter(t => t.id !== tripId));
    } catch (error) {
      console.error('Failed to delete trip');
    }
  };

  return (
    <TripContext.Provider value={{ trips, loading, fetchTrips, addTrip, updateTrip, deleteTrip }}>
      {children}
    </TripContext.Provider>
  );
};

export const useTrips = () => useContext(TripContext);