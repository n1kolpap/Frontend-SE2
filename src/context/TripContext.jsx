import React, { createContext, useState, useEffect } from 'react';
import apiClient from '../api/client';  // Add this import

export const TripContext = createContext();

export const TripProvider = ({ children }) => {
  const [trips, setTrips] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const fetchTrips = async () => {
    setLoading(true);
    try {
      const response = await apiClient.get('/trips');
      setTrips(response.data);
    } catch (err) {
      setError('Failed to fetch trips');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const createTrip = async (tripData) => {
    try {
      const response = await apiClient.post('/trips', tripData);
      setTrips([...trips, response.data]);
    } catch (err) {
      setError('Failed to create trip');
      console.error(err);
    }
  };

  const updateTrip = async (id, tripData) => {
    try {
      const response = await apiClient.put(`/trips/${id}`, tripData);
      setTrips(trips.map(trip => trip.id === id ? response.data : trip));
    } catch (err) {
      setError('Failed to update trip');
      console.error(err);
    }
  };

  const deleteTrip = async (id) => {
    try {
      await apiClient.delete(`/trips/${id}`);
      setTrips(trips.filter(trip => trip.id !== id));
    } catch (err) {
      setError('Failed to delete trip');
      console.error(err);
    }
  };

  useEffect(() => {
    fetchTrips();
  }, []);

  return (
    <TripContext.Provider value={{ trips, loading, error, fetchTrips, createTrip, updateTrip, deleteTrip }}>
      {children}
    </TripContext.Provider>
  );
};